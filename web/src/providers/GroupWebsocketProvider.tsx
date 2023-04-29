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
  const [loading, setLoading] = useState(false)
  const setPlayerCounts = usePlayerCountsSlice(state => state.setPlayerCounts)

  const toast = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading: groupQueryLoading } = useGetGroup({ groupId })

  const { } = useGetPlayerCount({
    groupId,
    sessionToken: session?.id,
    onSuccess: (counts) => {
      if (counts) {
        setPlayerCounts(counts)
      }
    }
  })

  const { sendJsonMessage, readyState: rs } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: async (event) => {
      try {
        const parsedData: IGroupWsResponse = JSON.parse(event.data)
        handleMessageData(parsedData)
      } catch (e) {
        console.error(e)
      }
    }
  })

  const handleMessageData = ({ messageType, data }: IGroupWsResponse) => {
    switch (messageType) {
      case GroupWSMessageTypes.Open:
        console.log({ messageType, data })
        break
      case GroupWSMessageTypes.PlayerUpdated:
        console.log({ messageType, data })
        break
      default:
        console.error({ messageType, data })
    }


  }





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
    setReadyState(rs)

    if (status === 'authenticated' && session && session.id && rs === ReadyState.OPEN) {
      openGroup(groupId)
    }

  }, [rs, status, session, groupId])






  return (
    <GroupWSContext.Provider value={{ ready: readyState === ReadyState.OPEN }}>
      {children}
    </GroupWSContext.Provider>
  )

}

export default function useGroupWs() {
  return useContext(GroupWSContext)
}