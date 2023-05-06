import { ApiRequest } from "./Rollmein.api"
import { useMutation, useQuery } from "react-query"
import { useSession } from "next-auth/react"
import { useGroupSlice } from "../stores/Group.slice"
import { IGroup, ICreateGroup, IUpdateGroup, IJoinGroupReq, IJoinGroupRes, IGroupDelete } from "@sharedTypes/Group"
import { RestMethods } from "@sharedTypes/RestMethods.enum"



export enum GroupRoutes {
  GROUP = "group",
  ADD_PLAYER = 'group/addPlayer',
  ADD_USER = 'group/addUser',
  USER_JOIN_GROUP = 'group/joinGroup',
}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
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
    }
  })
}

export const getGroup = async (groupId: string, sessionToken?: string) => await ApiRequest<IGroup, undefined>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetGroup = ({ groupId }: { groupId?: string, }) => {
  const { data: session } = useSession()
  const setGroup = useGroupSlice(state => state.setGroup)

  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (groupId && session && session.id) {
        return await getGroup(groupId, session.id)
      }
      return null
    },
    onSuccess: (res) => {
      if (res) {
        setGroup(res)
      }
    }
  })
}


export const createGroup = async (group: ICreateGroup, sessionToken: string) => await ApiRequest<IGroup, ICreateGroup>(GroupRoutes.GROUP, RestMethods.POST, { body: group, sessionToken })

export const useCreateGroup = () => useMutation({
  mutationFn: async ({ group, sessionToken }: { group: ICreateGroup, sessionToken?: string }) => {
    if (sessionToken) {
      return await createGroup(group, sessionToken)
    }
    return null
  }
})

export const updateGroup = async (group: IUpdateGroup, sessionToken: string) => await ApiRequest<IGroup, IUpdateGroup>(GroupRoutes.GROUP, RestMethods.PUT, { body: group, sessionToken })

export const useUpdateGroup = () => {
  const { data: session } = useSession()
  const sessionToken = session?.id
  const setGroup = useGroupSlice(state => state.setGroup)

  return useMutation({
    mutationFn: async ({ group }: { group: IUpdateGroup }) => {
      if (sessionToken) {
        return await updateGroup(group, sessionToken)
      }
      return null
    },
    onSuccess: (res) => {
      if (res) {
        setGroup(res)
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

export const useAddPlayerToGroup = ({ onSuccess }: { onSuccess: (player: IPlayer | null) => any }) => {
  const { data: session } = useSession()
  const sessionToken = session?.id ? session.id : undefined
  return useMutation({
    mutationFn: async (params: ICreatePlayer) => {
      if (sessionToken) {
        const res = await addPlayerToGroup(params, sessionToken)
        return res
      }
      return null
    },
    onSuccess
  })
}

export const addUserToGroup = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(GroupRoutes.ADD_USER, RestMethods.POST, { body: params, sessionToken })





