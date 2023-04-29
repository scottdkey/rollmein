import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetGroup } from "../utils/group.api";
import { useGroupSlice } from "../stores/Group.slice";
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { IGroupWsResponse } from "../types/Group";
import { GroupWSMessageTypes } from "../types/GroupMessages.enum";
import { useGetPlayerCount } from "../utils/playerCounts.api";
import { usePlayerCountsSlice } from "../stores/PlayerCounts.slice";

interface IGroupWsContext {
  ready: boolean
}


export const GroupWSContext = createContext<IGroupWsContext>({} as IGroupWsContext)

export const GroupWsProvider = ({ children, groupId }: { children: ReactNode, groupId: string }): JSX.Element => {
  const { status, data: session } = useSession()
  const setGroup = useGroupSlice((state) => state.setGroup)
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.UNINSTANTIATED)
  const [loading, setLoadig] = useState(false)
  const setPlayerCounts = usePlayerCountsSlice(state => state.setPlayerCounts)

  const toast = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading: groupQueryLoading } = useGetGroup({
    groupId,
    sessionToken: session?.id,
    onSuccess: (group) => {
      if (group) {
        setGroup(group)
      }
    }
  })

  const { sendJsonMessage, readyState: rs } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
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
              console.log({ id, data })
              queryClient.setQueryData(id, data)
            })
          }
          if (parsedData && parsedData.deleteData && parsedData.deleteData?.length > 0) {
            parsedData.deleteData.forEach((key) => {
              console.log({ key })
              queryClient.removeQueries(key)
            })
          }
          setReadyState(rs)
        }
      } catch (e) {
        console.error(e)
      }
    }
  })



  const { } = useGetPlayerCount({
    groupId,
    sessionToken: session?.id,
    onSuccess: (counts) => {
      if (counts) {
        setPlayerCounts(counts)
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


  useEffect(() => {
    const openGroup = async (groupId: string) => {
      if (session && session.id) {
        sendMessage(GroupWSMessageTypes.Open, { groupId }, session?.id)
      } else {
        toast({
          title: 'You need to be logged in to do that'
        })
      }
    }
    setReadyState(readyState)

    if (status === 'authenticated' && session && session.id && readyState === ReadyState.OPEN) {
      openGroup(groupId)
    }

  }, [readyState, status, session, groupId])






  return (
    <GroupWSContext.Provider value={{ ready: readyState === ReadyState.OPEN }}>
      {children}
    </GroupWSContext.Provider>
  )

}

export default function useGroupWs() {
  return useContext(GroupWSContext)
}