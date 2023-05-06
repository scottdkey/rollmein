import { useQuery } from "react-query";
import { ApiRequest } from "./Rollmein.api";
import { IGroupPlayerCountResponse } from "@sharedTypes/Group";
import { RestMethods } from "@sharedTypes/RestMethods.enum";

export enum PlayerCountRoutes {
  COUNT = 'group/count'
}

export const getGroupPlayerCount = async (groupId: string, sessionToken: string) => await ApiRequest<IGroupPlayerCountResponse, undefined>(`${PlayerCountRoutes.COUNT}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetPlayerCount = ({ onSuccess, groupId, sessionToken }: { onSuccess: (playerCounts: IGroupPlayerCountResponse | null) => any, groupId?: string, sessionToken?: string, onError?: (error: any) => void }) => useQuery({
  queryKey: ["playerCount", groupId],
  queryFn: async () => {
    if (groupId && sessionToken) {
      return await getGroupPlayerCount(groupId, sessionToken)
    }
    return null
  },
  onSuccess
})