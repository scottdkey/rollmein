import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useSession } from "next-auth/react"
import { usePlayersSlice } from "../stores/Players.slice"
import { RestMethods } from "../types/RestMethods.enum"
import { PlayerRoutes } from "../types/PlayerRoutes.enum"





export const getPlayer = async (playerId?: string, sessionToken?: string) => {
  if (playerId && sessionToken) {
    const res = await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER}/${playerId}`, RestMethods.GET, { sessionToken })
    if (res) {
      return res
    }
  }
  return null
}

export const useGetPlayer = ({ playerId, enabled = true }: { enabled?: boolean, playerId?: string }) => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  return useQuery({
    enabled,
    queryKey: ["player", playerId],
    queryFn: async () => {
      if (playerId && sessionToken) {
        return await getPlayer(playerId, sessionToken)
      }
      return null
    },
    onSuccess: (res) => {
      if (res) {
        usePlayersSlice.getState().handlePlayerChange(res)
      }
    },
    onError: (err) => {
      console.error(err)
    }
  })
}

export const getGroupPlayers = async (groupId: string, sessionToken: string) =>
  await ApiRequest<IPlayer[], undefined>(`${PlayerRoutes.PLAYERS}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetGroupPlayers = ({ groupId }: { groupId?: string }) => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const setPlayers = usePlayersSlice(state => state.setPlayers)

  return useQuery({
    queryKey: ["players", groupId],
    queryFn: async () => {
      if (groupId && sessionToken) {
        const res = await getGroupPlayers(groupId, sessionToken)
        if (res) {
          return res.sort((a, b) => a.name.localeCompare(b.name))
        }
        return []
      }
      return []
    },
    onSuccess: (res) => {
      if (res) {
        setPlayers(res)
      }
    }
  })
}

export const getSignedInUserPlayer = async (sessionToken: string) => await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER_BY_SIGNED_IN_USER}`, RestMethods.GET, { sessionToken })

export const useGetSignedInUserPlayer = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  return useQuery({
    queryKey: ["user-player"],
    queryFn: async (): Promise<IPlayer | undefined> => {
      if (sessionToken) {
        return await getSignedInUserPlayer(sessionToken)
      }
      return
    },
    onSuccess: (res) => {
      if (res) {
        usePlayersSlice.getState().handlePlayerChange(res)
      }
    }
  })
}

export const getPlayerFromUserId = async (userId: string, sessionToken: string) => await ApiRequest<IPlayer, undefined>(`${PlayerRoutes.PLAYER_BY_USER_ID}/${userId}`, RestMethods.GET, { sessionToken })

export const createPlayer = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(PlayerRoutes.PLAYER, RestMethods.POST, { body: params, sessionToken })

export const useCreatePlayer = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ICreatePlayer) => {
      if (sessionToken) {
        return await createPlayer(params, sessionToken)
      }
      return null
    },
    onSuccess: (data) => {
      if (data) {
        usePlayersSlice.getState().handlePlayerChange(data)
        queryClient.invalidateQueries("players")
        queryClient.setQueryData(["player", data.id], data)
      }
    }
  })
}

export const updatePlayer = async (params: IUpdatePlayer, sessionToken: string) => {
  try {
    return await ApiRequest<IPlayer, IUpdatePlayer>(PlayerRoutes.PLAYER, RestMethods.PUT, { body: params, sessionToken })
  } catch (e) {
    console.error(e)
    return
  }
}

export const useUpdatePlayer = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: IUpdatePlayer) => {
      if (sessionToken) {
        return await updatePlayer(params, sessionToken)
      }
      return
    },
    onSuccess: (data) => {
      if (data) {
        usePlayersSlice.getState().handlePlayerChange(data)
        queryClient.invalidateQueries("players")
        queryClient.setQueryData(["player", data.id], data)
      }
    }
  })
}

export const deletePlayer = async (sessionToken: string) => await ApiRequest<IPlayer, IDeletePlayer>(PlayerRoutes.PLAYER, RestMethods.DELETE, { sessionToken })

export const useDeletePlayer = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {

      if (sessionToken) {
        return await deletePlayer(sessionToken)
      }
      return
    }
  })
}



