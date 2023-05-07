import { useQuery } from "react-query";
import { ApiRequest } from "./Rollmein.api";
import { IGroupPlayerCountResponse } from "@sharedTypes/Group";
import { RestMethods } from "@sharedTypes/RestMethods.enum";
import { useSession } from "next-auth/react";
import { usePlayerCountsSlice } from "../stores/PlayerCounts.slice";

export enum PlayerCountRoutes {
  COUNT = 'group/count'
}

export const getGroupPlayerCount = async (groupId: string, sessionToken: string) => await ApiRequest<IGroupPlayerCountResponse, undefined>(`${PlayerCountRoutes.COUNT}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetPlayerCount = ({ groupId }: { groupId?: string }) => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const setPlayerCounts = usePlayerCountsSlice(state => state.setPlayerCounts)
  return useQuery({
    queryKey: ["playerCount", groupId],
    queryFn: async () => {
      if (groupId && sessionToken) {
        return await getGroupPlayerCount(groupId, sessionToken)
      }
      return null
    },
    onSuccess: (data) => {
      if (data) {
        setPlayerCounts(data)
      }
    }
  })
}