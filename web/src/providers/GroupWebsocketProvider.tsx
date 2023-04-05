import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { GroupWSMessageTypes } from "../types/GroupMessages.enum";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { IGroupWsResponse } from "../types/Group";
import { useGroupQuery, useUserJoinGroupMutation } from "../utils/groupApi";
import useWebSocket from "react-use-websocket";
import { useQueryClient } from "react-query";
import { randomUUID } from "crypto";

export enum WebsocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
  UNINSTANTIATED = 4,
}

interface IGroupWsContext {
  groupId: string
  joinGroup: () => void
  openGroup: () => void
  sendMessage: (messageType: GroupWSMessageTypes, body: any) => void
  requestCode: string
}

export const GroupWSContext = createContext<IGroupWsContext>({} as IGroupWsContext)

export const GroupWsProvider = ({ children, groupId }: { children: ReactNode, groupId: string }): JSX.Element => {
  const toast = useToast()
  const { status, data: session } = useSession()
  const { data } = useGroupQuery(groupId, true)
  const joinGroupMutation = useUserJoinGroupMutation()
  const queryClient = useQueryClient()
  const requestCode = randomUUID()

  const { sendJsonMessage, readyState } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: (event) => {
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
        if (parsedData.deleteData && parsedData.deleteData?.length > 0) {
          parsedData.deleteData.forEach((key) => {
            queryClient.removeQueries(key)
          })
        }
        switch (parsedData.messageType) {
          case GroupWSMessageTypes.Open:
            joinGroup()
            break
          default:
            break
        }


      }
    }

  })

  const openGroup = async () => sendMessage(GroupWSMessageTypes.Open, { groupId })

  const sendMessage = (messageType: GroupWSMessageTypes, body: any) => {
    const sessionToken = session?.id
    const message = {
      messageType,
      sessionToken,
      ...body
    }
    sendJsonMessage(message)
  }


  const joinGroup = async () => {
    await joinGroupMutation.mutateAsync({
      groupId
    })
  }


  useEffect(() => {
    const ready = readyStateHandler(readyState)

    if (status === 'authenticated' && session && session?.id && ready) {
      openGroup()
    }

  }, [readyState, status, session])

  const memoedValue = useMemo(() => ({
    groupId,
    joinGroup,
    openGroup,
    sendMessage,
    requestCode
  }), [groupId, data])

  const readyStateHandler = (readyState: number) => {
    switch (readyState) {
      case WebsocketReadyState.CONNECTING:
        break
      case WebsocketReadyState.OPEN:
        return true
      case WebsocketReadyState.CLOSED:
        break
      case WebsocketReadyState.CLOSING:
        break
      case WebsocketReadyState.UNINSTANTIATED:
        break
      default:
        console.debug('unknown ready state for group websocket')
        break
    }
    return false
  }




  return (
    <GroupWSContext.Provider value={memoedValue}>
      {children}
    </GroupWSContext.Provider>
  )

}

export default function useGroupWs() {
  return useContext(GroupWSContext)
}