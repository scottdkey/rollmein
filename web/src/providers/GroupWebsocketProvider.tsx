import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetGroup } from "../utils/group.api";
import { useGroupSlice } from "../stores/Group.slice";
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useGetPlayerCount } from "../utils/playerCounts.api";
import { usePlayerCountsSlice } from "../stores/PlayerCounts.slice";
import { IGroupWsResponse } from "@sharedTypes/Group";
import { GroupWSMessageTypes } from "@sharedTypes/GroupMessages.enum";
import { usePlayersSlice } from "../stores/Players.slice";
import { useCurrentGroupSlice } from "../stores/CurrentGroup.slice";

interface IGroupWsContext {
  ready: boolean
}


export const GroupWSContext = createContext<IGroupWsContext>({} as IGroupWsContext)

export const GroupWsProvider = ({ children, groupId }: { children: ReactNode, groupId: string }): JSX.Element => {
  const { status, data: session } = useSession()
  const upsertGroup = useGroupSlice((state) => state.upsertGroup)
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.UNINSTANTIATED)
  const setPlayerCounts = usePlayerCountsSlice(state => state.setPlayerCounts)
  const handlePlayerChange = usePlayersSlice(state => state.handlePlayerChange)
  const setGroup = useCurrentGroupSlice(state => state.setGroup)

  const toast = useToast()

  const { } = useGetPlayerCount({
    groupId
  })

  const { sendJsonMessage, readyState: rs } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: async (event) => {
      try {
        const parsedData: IGroupWsResponse = JSON.parse(event.data)
        handleMessageData(parsedData)
      } catch (e) {
        console.error(e)
      }
    },
    shouldReconnect: (closeEvent) => true,
  })

  const handleMessageData = ({ messageType, data }: IGroupWsResponse) => {
    console.log({ messageType, data })
    switch (messageType) {
      case GroupWSMessageTypes.Open:
        upsertGroup(data)
        setGroup(data)
        break
      case GroupWSMessageTypes.PlayerUpdated:
        handlePlayerChange(data)
        break
      case GroupWSMessageTypes.CountUpdated:
        setPlayerCounts(data)
        break
      case GroupWSMessageTypes.PlayerAdded:
        handlePlayerChange(data)
        break
      case GroupWSMessageTypes.GroupUpdated:
        upsertGroup(data)
        setGroup(data)
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
    if (readyState !== ReadyState.OPEN && session && session.id) {
      sendMessage(GroupWSMessageTypes.Open, { groupId }, session?.id)
    }
  }, [readyState, session, groupId])


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