import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useSession } from "next-auth/react"
import { useGroupSlice } from "../stores/Group.slice"
import { IGroup, ICreateGroup, IUpdateGroup, IJoinGroupReq, IJoinGroupRes, IGroupDelete } from "../types/Group"
import { RestMethods } from "../types/RestMethods.enum"
import { IApplicationError } from "../types/ApplicationError"
import { useCurrentGroupSlice } from "../stores/CurrentGroup.slice"



export enum GroupRoutes {
  GROUP = "group",
  ADD_PLAYER = 'group/addPlayer',
  ADD_USER = 'group/addUser',
  USER_JOIN_GROUP = 'group/joinGroup',
}


export const getGroups = async (sessionToken?: string) => {
  const res = await ApiRequest<IGroup[], undefined>(GroupRoutes.GROUP, RestMethods.GET, { sessionToken })
  if (res) {
    return res
  }
  return []
}

export const useGetGroups = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const setGroups = useGroupSlice(state => state.setGroups)
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => await getGroups(sessionToken),
    onSuccess: (res) => {
      if (res) {
        setGroups(res)
      }
    },
    onError: (err) => {
      console.error(err)
    }
  })
}

export const getGroup = async (groupId: string, sessionToken?: string) => await ApiRequest<{
  group: IGroup,
  error: null
}, {
  group: null,
  error: IApplicationError
}>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetGroup = ({ groupId }: { groupId: string | null }) => {
  const { data: session } = useSession()
  const upsertGroup = useGroupSlice(state => state.upsertGroup)
  const setGroup = useCurrentGroupSlice(state => state.setGroup)

  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (groupId && session && session.id) {
        const res = await getGroup(groupId, session.id)
        return res?.group
      }
      return null
    },
    onSuccess: (res) => {
      if (res) {
        upsertGroup(res)
        setGroup(res)
        return res
      }
      return null
    },
    onError: (err) => {
      console.error(err)
      return null
    },
    enabled: groupId !== null
  })
}


export const createGroup = async (group: ICreateGroup, sessionToken: string) => await ApiRequest<IGroup, ICreateGroup>(GroupRoutes.GROUP, RestMethods.POST, { body: group, sessionToken })

export const useCreateGroup = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const upsertGroup = useGroupSlice(state => state.upsertGroup)
  const { refetch } = useGetGroups()
  return useMutation({
    mutationFn: async ({ group }: { group: ICreateGroup }) => {
      if (sessionToken) {
        return await createGroup(group, sessionToken)
      }
      return null
    },
    onSuccess: (res) => {
      refetch()
      if (res) {
        upsertGroup(res)
      }
    }
  })
}

export const updateGroup = async (group: IUpdateGroup, sessionToken: string) => await ApiRequest<IGroup, IUpdateGroup>(GroupRoutes.GROUP, RestMethods.PUT, { body: group, sessionToken })

export const useUpdateGroup = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const { refetch } = useGetGroups()
  const upsertGroup = useGroupSlice(state => state.upsertGroup)

  return useMutation({
    mutationFn: async ({ group }: { group: IUpdateGroup }) => {
      if (sessionToken) {
        return await updateGroup(group, sessionToken)
      }
      return
    },
    onSuccess: (res) => {
      refetch()
      if (res) {
        upsertGroup(res)
      }
    }
  })

}

export const userJoinGroup = async (params: IJoinGroupReq, sessionToken: string) => await ApiRequest<IJoinGroupRes, IJoinGroupReq>(GroupRoutes.USER_JOIN_GROUP, RestMethods.POST, { body: params, sessionToken })

export const deleteGroup = async ({ sessionToken, groupId }: { sessionToken?: string, groupId: string }) => {
  const requestObject: IGroupDelete = {
    id: groupId
  }
  if (sessionToken) {
    const res = await ApiRequest<IGroup, IGroupDelete>(GroupRoutes.GROUP, RestMethods.DELETE, { body: requestObject, sessionToken })
    if (res) {
      return res
    }
    return null
  }
  return null
}

export const useDeleteGroup = ({ onSuccess }: { onSuccess: (group: IGroup | null) => any }) => useMutation({
  mutationFn: async (request: { groupId: string, sessionToken?: string }) => {
    return await deleteGroup(request)
  },
  onSuccess
})

export const addPlayerToGroup = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(GroupRoutes.ADD_PLAYER, RestMethods.POST, { body: params, sessionToken })

export const useAddPlayerToGroup = ({ groupId }: { groupId: string | null }) => {
  const { data: session } = useSession()
  const sessionToken = session?.id ? session.id : undefined
  const { refetch } = useGetGroup({ groupId })
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: ICreatePlayer) => {
      if (sessionToken) {
        return await addPlayerToGroup(params, sessionToken)
      }
      return
    },
    onSuccess: (res) => {
      if (res) {
        refetch()
        queryClient.setQueryData(["group", groupId], (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              relations: {
                ...oldData.relations,
                players: [...oldData.relations.players, res]
              }
            }
          }
          return null
        })
      }
    }
  })
}

export const addUserToGroup = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(GroupRoutes.ADD_USER, RestMethods.POST, { body: params, sessionToken })





