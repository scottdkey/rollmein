import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { GroupWSMessageTypes } from "../types/GroupMessages.enum";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { IGroupWsResponse } from "../types/Group";
import { useGroupPlayerCountQuery, useGroupQuery, useUserJoinGroupMutation } from "../utils/group.api";
import useWebSocket from "react-use-websocket";
import { useQueryClient } from "react-query";
import { WebsocketReadyState, useGroupState } from "../components/Group/Group.slice";

interface IGroupWsContext {
  ready: boolean
}


export const GroupWSContext = createContext<IGroupWsContext>({} as IGroupWsContext)

export const GroupWsProvider = ({ children, groupId }: { children: ReactNode, groupId: string }): JSX.Element => {
  const { status, data: session } = useSession()
  const { data, isLoading: groupQueryLoading } = useGroupQuery(groupId, true)



  const { data: currentCounts, isLoading: countLoading, error } = useGroupPlayerCountQuery(groupId, true)
  const toggleGroupLoading = useGroupState((state) => state.toggleLoading)
  const toggleWsOpen = useGroupState((state) => state.toggleWsOpen)
  const togglePlayerCountLoading = useGroupState((state) => state.togglePlayerCountLoading)

  const ready = useGroupState((state) => state.wsOpen)
  const setGroup = useGroupState((state) => state.setGroup)
  const setPlayerCounts = useGroupState((state) => state.setPlayerCounts)
  const init = useGroupState((state) => state.init)






  const readyStateHandler = (readyState: number) => {
    try {
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
          console.debug('unknown ready state for group websocket', readyState)
          break
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }






  useEffect(() => {
    const ready = readyStateHandler(readyState)

    if (status === 'authenticated' && session && session.id && ready) {
      openGroup(groupId)
    }


  }, [readyState, status, session])

  useEffect(() => {
    if (data) {
      toggleGroupLoading()
      setGroup(data)
      toggleGroupLoading()
    }
  }, [data])
  useEffect(() => {
    if (currentCounts) {
      togglePlayerCountLoading()
      setPlayerCounts(currentCounts)
      togglePlayerCountLoading()
    }
  }, [currentCounts])

  useEffect(() => {
    init({ sendMessage, openGroup })
  }, [])




  return (
    <GroupWSContext.Provider value={{ ready }}>
      {children}
    </GroupWSContext.Provider>
  )

}

export default function useGroupWs() {
  return useContext(GroupWSContext)
}