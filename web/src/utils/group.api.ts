import { ApiRequest } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { ICreateGroup, IGroup, IGroupDelete, IJoinGroupReq, IJoinGroupRes, IUpdateGroup } from "../types/Group"
import { useMutation, useQuery } from "react-query"



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

export const useGetGroups = ({ onSuccess, sessionToken }: { onSuccess: (groups: IGroup[]) => any, sessionToken?: string }) => useQuery({
  queryKey: ["groups"],
  queryFn: async () => await getGroups(sessionToken),
  onSuccess
})

export const getGroup = async (groupId: string, sessionToken?: string) => await ApiRequest<IGroup, undefined>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET, { sessionToken })

export const useGetGroup = ({ onSuccess, sessionToken, groupId }: { onSuccess: (group: IGroup | null) => any, groupId?: string, sessionToken?: string }) => useQuery({
  queryKey: ["group", groupId],
  queryFn: async () => {
    if (groupId && sessionToken) {
      return await getGroup(groupId, sessionToken)
    }
    return null
  },
  onSuccess
})


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

export const useUpdateGroup = () => useMutation({
  mutationFn: async({group, sessionToken}:{ group: IUpdateGroup, sessionToken?: string }) => {
    if (sessionToken) {
      return await updateGroup(group, sessionToken)
    }
    return null
  }
})

export const userJoinGroup = async (params: IJoinGroupReq, sessionToken: string) => await ApiRequest<IJoinGroupRes, IJoinGroupReq>(GroupRoutes.USER_JOIN_GROUP, RestMethods.POST, { body: params, sessionToken })

export const deleteGroup = async ({sessionToken, groupId }: { sessionToken?: string, groupId: string}) => {
  const requestObject: IGroupDelete = {
    id : groupId
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
  mutationFn: async (request: {groupId: string, sessionToken?:string}) => {
    return await deleteGroup(request)
  },
  onSuccess
})

export const addPlayerToGroup = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(GroupRoutes.ADD_PLAYER, RestMethods.POST, { body: params, sessionToken })

export const useAddPlayerToGroup = ({ onSuccess }: { onSuccess: (player: IPlayer | null) => any }) => useMutation({
  mutationFn: async (params: ICreatePlayer, sessionToken?: string) => {
    if (sessionToken) {
      return await addPlayerToGroup(params, sessionToken)
    }
    return null
  },
  onSuccess
})

export const addUserToGroup = async (params: ICreatePlayer, sessionToken: string) => await ApiRequest<IPlayer, ICreatePlayer>(GroupRoutes.ADD_USER, RestMethods.POST, { body: params, sessionToken })





