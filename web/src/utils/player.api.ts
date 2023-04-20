import { ApiRequest } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import {  useMutation, useQuery } from "react-query"



export enum PlayerRoutes {
  PLAYERS = 'player/group',
  PLAYER = 'player',
  PLAYER_BY_SIGNED_IN_USER = 'user/player',
  PLAYER_BY_USER_ID = 'player/:userId'

}

export const getPlayer = async(playerId?: string, sessionToken?: string) => {
  if(playerId && sessionToken){
    const res = await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER}/${playerId}`, RestMethods.GET, { sessionToken })
    if (res) {
      return res
    }
  }
  return null
}

export const useGetPlayer = ({onSuccess, sessionId, playerId, onError }: { onSuccess: (data: IPlayer | null) => void, playerId?: string, sessionId?: string, onError?: (error: any) => void }) => useQuery({
  queryKey: ["player", playerId],
  queryFn: async () => {
    if (playerId && sessionId) {
      return await getPlayer(playerId, sessionId)
    }
    return null
  },
  onSuccess,
  onError
})

export const getGroupPlayers = async (groupId: string, sessionToken: string) => 
await ApiRequest<IPlayer[], undefined>(`${PlayerRoutes.PLAYERS}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetGroupPlayers = ({ onSuccess, groupId, sessionToken }: { onSuccess: (players: IPlayer[]) => any, groupId?: string, sessionToken?: string }) => useQuery({
  queryKey: ["players", groupId],
  queryFn: async () => {
    if (groupId && sessionToken) {
      const res = await getGroupPlayers(groupId, sessionToken)
      if(res) return res
      return []
    }
    return []
  },
  onSuccess
})

export const getSignedInUserPlayer = async (sessionToken: string) => await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER_BY_SIGNED_IN_USER}`, RestMethods.GET, { sessionToken })

export const getPlayerFromUserId = async (userId: string, sessionToken: string) => await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER_BY_USER_ID}/${userId}`, RestMethods.GET, { sessionToken })

export const createPlayer = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(PlayerRoutes.PLAYER, RestMethods.POST, { body: params, sessionToken })

export const useCreatePlayer = (setterFunction?: (player: IPlayer | null) => any) => useMutation({
  mutationFn: async(params: ICreatePlayer, sessionToken?: string) => {
   if(sessionToken){
     return await createPlayer(params, sessionToken)
   }
   return null
  },
  onSuccess: (data) => {
    if(setterFunction){
      setterFunction(data)
    }
  }
})

export const updatePlayer= async (params: IUpdatePlayer, sessionToken: string) => await ApiRequest<IPlayer, IUpdatePlayer>(PlayerRoutes.PLAYER, RestMethods.PUT, { body: params, sessionToken })

export const useUpdatePlayer = () => useMutation({
  mutationFn: async(params: IUpdatePlayer, sessionToken?: string) => {
    if(sessionToken){
      return await updatePlayer(params, sessionToken)
    }
    return null
  }
})

export const deletePlayer = async (sessionToken: string) => await ApiRequest<IPlayer, IDeletePlayer>(PlayerRoutes.PLAYER, RestMethods.DELETE, { sessionToken })



