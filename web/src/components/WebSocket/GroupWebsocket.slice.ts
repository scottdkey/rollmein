import { create } from 'zustand'
import { v4 } from "uuid"
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useToast } from '@chakra-ui/react'
import { useQueryClient } from 'react-query'

interface GroupWebsocketState {
  loading: boolean
  requestCode: string
  wsOpen: boolean
  groupId: string | null
  openGroup: (groupId: string, sessionToken: string) => void
  sendMessage: (messageType: GroupWSMessageTypes, body: any, sessionToken: string) => void
  toggleLoading: () => void,
  toggleWsOpen: () => void,
}

export enum WebsocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
  UNINSTANTIATED = 4,
}

export const useGroupWebsocket = create<GroupWebsocketState>((set) => {
  const toast = useToast()
  const queryClient = useQueryClient()

  const { sendJsonMessage, readyState } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: async (event) => {
      try {
        const parsedData: IGroupWsResponse = JSON.parse(event.data)
        if (Object.keys(event.data).length > 0) {
          if (parsedData.refetchQueries && parsedData.refetchQueries.length > 0) {

            parsedData.refetchQueries?.forEach(query => {
              queryClient.refetchQueries(query)
            })
          }
          if (parsedData.announceMessage) {
            toast({
              title: parsedData.announceMessage
            })
          }
          if (parsedData.setData && parsedData.setData?.length > 0) {
            parsedData.setData.forEach(({ id, data }) => {
              queryClient.setQueryData(id, data)
            })
          }
          if (parsedData && parsedData.deleteData && parsedData.deleteData?.length > 0) {
            parsedData.deleteData.forEach((key) => {
              console.log(key)
              queryClient.removeQueries(key)
            })
          }
          switch (readyState) {
            case ReadyState.OPEN:
              set({ wsOpen: true })
              break
            default:
              break
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  })

  const sendMessage = (messageType: GroupWSMessageTypes, body: any, sessionToken: string) => {
    try {
      const message = {
        messageType,
        sessionToken,
        ...body
      }
      sendJsonMessage(message)
    } catch (e) {
      console.error(e)
    }
  }
  const openGroup = async (groupId: string, sessionToken: string) => sendMessage(GroupWSMessageTypes.Open, { groupId }, sessionToken)

  const toggleLoading = () => set((state) => ({ loading: !state.loading }))

  return ({
    groupId: null,
    loading: false,
    requestCode: v4(),
    wsOpen: false,
    openGroup,
    sendMessage,
    toggleLoading,
    toggleWsOpen: () => set((state) => ({ wsOpen: !state.wsOpen })),
  })
})