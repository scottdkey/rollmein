import { UseQuery, UseMutation, ApiRequest } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { ICreateGroup, IGroup, IGroupDelete, IGroupError, IGroupUpdate, IJoinGroupReq, IJoinGroupRes } from "../types/Group"


export enum GroupRoutes {
  GROUP = "group",
  ADD_PLAYER = 'group/addPlayer',
  ADD_USER = 'group/addUser',
  USER_JOIN_GROUP = 'group/joinGroup'
}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}



export const useGroupsQuery = () => {
  return UseQuery<IGroup[], {}>(GroupRoutes.GROUP, GroupRoutes.GROUP, true, 'group')
}

export const useGroupQuery = (groupId: string, enabled: boolean) => {
  const route = `${GroupRoutes.GROUP}/${groupId}`
  const queryKey = `${GroupRoutes.GROUP}-${groupId}`
  return UseQuery<IGroup, {}>(route, queryKey, enabled, groupId)
}

export const useCreateGroupMutation = () => UseMutation<IGroup, IGroupError, ICreateGroup>(GroupRoutes.GROUP, RestMethods.POST, GroupRoutes.GROUP)


export const useUpdateGroupMutation = () => UseMutation<IGroup, IGroupError, IGroupUpdate>(GroupRoutes.GROUP, RestMethods.PUT, 'updateGroup')

export const useUserJoinGroupMutation = () => UseMutation<IJoinGroupRes, IGroupError, IJoinGroupReq>(GroupRoutes.USER_JOIN_GROUP, RestMethods.POST, 'joinGroup')

export const useDeleteGroupMutation = () =>
  UseMutation<{ success: boolean }, IGroupError, IGroupDelete>(GroupRoutes.GROUP, RestMethods.DELETE, 'deleteGroup')

export const useAddPlayerToGroupMutation = () => UseMutation<IPlayer, {}, ICreatePlayer>(GroupRoutes.ADD_PLAYER, RestMethods.POST, 'addPlayerToGroup')

export const useAddUserToGroupMutation = () => UseMutation<IPlayer, {}, { userId: string }>(GroupRoutes.ADD_USER, RestMethods.POST, 'addUserToGroup')

