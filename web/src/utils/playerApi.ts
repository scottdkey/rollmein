import { UseQueryOptions, useQuery, } from "react-query"
import { ApiRequest, UseMutation, UseQuery } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { useSession } from "next-auth/react"


export enum PlayerRoutes {
  PLAYERS = 'player',
  PLAYER = 'player',
  PLAYER_BY_SIGNED_IN_USER = 'user/player',
  PLAYER_BY_USER_ID = 'player/:userId'

}

const PlayerQueryById = async (id?: string, sessionToken?: string) => {
  if (id !== undefined && sessionToken !== undefined) {
    return await ApiRequest<IPlayer, {}>(`${PlayerRoutes.PLAYER}/${id}`, RestMethods.GET, { sessionToken })
  }
  return {
    data: null,
    error: `missing query id ${id}`
  }
}

export const usePlayerQuery = (enabled: boolean = true, playerId?: string) => {
  const route = `${PlayerRoutes.PLAYER}/${playerId}`
  const queryKey = `${PlayerRoutes.PLAYER}-${playerId}`
  return UseQuery<IPlayer, {}>(route, queryKey, enabled, playerId)
}

export const usePlayerFromSignedInUserQuery = (enabled: boolean = true) => {
  const route = PlayerRoutes.PLAYER_BY_SIGNED_IN_USER
  return UseQuery<IPlayer, {}>(route, route, enabled, "signedInUser")
}

export const usePlayerFromUserIdQuery = (userId: string, enabled: boolean = true) => {
  const route = PlayerRoutes.PLAYER_BY_USER_ID
  const queryKey = `${route}-${userId}`
  return UseQuery<IPlayer, {}>(route, queryKey, enabled, userId)

}


export const usePlayersQuery = (groupId: string, enabled: boolean = true) => {
  const route = `${PlayerRoutes.PLAYERS}/${groupId}`
  const queryKey = `${PlayerRoutes.PLAYERS}-${groupId}`
  return UseQuery<IPlayer, {}>(route, queryKey, enabled, groupId)
}

export const useCreatePlayerMutation = () => {
  return UseMutation<IPlayer, {}, ICreatePlayer>(PlayerRoutes.PLAYER, RestMethods.POST, "createPlayer")
}

export const useUpdatePlayerMutation = () => {
  return UseMutation<IPlayer, {}, IUpdatePlayer>(PlayerRoutes.PLAYER, RestMethods.PUT, "updatePlayer")
}

export const useDeletePlayerMutation = () => {
  return UseMutation<IPlayer, {}, IDeletePlayer>(PlayerRoutes.PLAYER, RestMethods.DELETE, "deletePlayer")
}



