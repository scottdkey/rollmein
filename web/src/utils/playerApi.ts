import { UseMutationOptions, UseQueryOptions, useQueryClient } from "react-query"
import { ICreatePlayer, IDeletePlayer, IUpdatePlayer, Player } from "../../../api/src/types/Player"
import { UseMutation, UseQuery } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { DataResponse } from "../../../api/src/types/DataResponse"


export enum PlayerRoutes {
  PLAYERS = 'player',
  PLAYER = 'player',
  PLAYER_BY_SIGNED_IN_USER = 'user/player'

}

export const usePlayerQuery = (playerId?: string) => {
  const route = `${PlayerRoutes.PLAYER}/${playerId}`
  const options: UseQueryOptions<Player, {}> = {
    queryKey: `${PlayerRoutes.PLAYER}-${playerId}`
  }
  return UseQuery(route, options)
}

export const usePlayerFromSignedInUserQuery = () => {
  const route = PlayerRoutes.PLAYER_BY_SIGNED_IN_USER
  const queryClient = useQueryClient()
  const options: UseQueryOptions<Player, {}> = {
    queryKey: PlayerRoutes.PLAYER_BY_SIGNED_IN_USER,
    onSuccess: (data) => {
      queryClient.setQueryData(`${PlayerRoutes.PLAYER}-${data.id}`, data)
    }
  }
  return UseQuery(route, options)
}

export const usePlayersQuery = (groupId: string) => {
  const route = `${PlayerRoutes.PLAYERS}/${groupId}`
  const options: UseQueryOptions<Player[], {}> = {
    queryKey: `${PlayerRoutes.PLAYERS}-${groupId}`
  }
  return UseQuery(route, options)
}

export const useCreatePlayerMutation = (options: UseMutationOptions<Player, {}, ICreatePlayer>) => {
  return UseMutation(PlayerRoutes.PLAYER, RestMethods.POST, options)
}

export const useUpdatePlayerMutation = (options: UseMutationOptions<DataResponse<Player>, {}, IUpdatePlayer>) => {
  return UseMutation(PlayerRoutes.PLAYER, RestMethods.PUT, options)
}

export const useDeletePlayerMutation = (options: UseMutationOptions<Player, {}, IDeletePlayer>) => {
  return UseMutation(PlayerRoutes.PLAYER, RestMethods.DELETE, options)
}



