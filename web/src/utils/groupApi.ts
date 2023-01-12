import { UseQueryOptions, useQuery } from "react-query"
import { UseQuery, UseMutation, ApiRequest } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { useSession } from "next-auth/react"


export enum GroupRoutes {
  GROUP = "group",
  ADD_PLAYER = 'group/addPlayer',
  ADD_USER = 'group/addUser'
}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}

export enum GroupWSMessageTypes {
  ADD_PLAYER = "addPlayer",
  REMOVE_PLAYER = 'removePlayer',
  PLAYER_UPDATED = 'playerUpdated',
  ADD_MEMBER = "addMember",
  REMOVE_MEMBER = 'removeMember',
  MEMBER_UPDATED = 'memberUpdated',
  ROLL_STARTED = 'rollStarted',
  ROLL_ENDED = 'rollEnded',
}

export const useGroupsQuery = () => {
  return UseQuery<IGroup[], {}>(GroupRoutes.GROUP, GroupRoutes.GROUP, 'group')
}

const getGroupById = async (groupId?: string, sessionToken?: string) => {
  if (sessionToken && groupId !== undefined) {
    const route = `${GroupRoutes.GROUP}/${groupId}`
    return await ApiRequest<IGroup, {}>(route, RestMethods.GET, { sessionToken })
  } else {
    return {
      message: "no group id provided"
    }
  }
}

export const useGroupQuery = (groupId: string) => {
  const route = `${GroupRoutes.GROUP}/${groupId}`
  const queryKey = `${GroupRoutes.GROUP}-${groupId}`
  return UseQuery<IGroup, {}>(route, queryKey, groupId)
}

export const useCreateGroupMutation = () => UseMutation<IGroup, IGroupError, ICreateGroup>(GroupRoutes.GROUP, RestMethods.POST, GroupRoutes.GROUP)

export const createGroupPost = async (body: ICreateGroup, sessionToken?: string) => {
  if (sessionToken) {
    return await ApiRequest<IGroup, ICreateGroup>(GroupRoutes.GROUP, RestMethods.POST, { body, sessionToken })
  }
  return
}


export const useUpdateGroupMutation = () => UseMutation<IGroup, IGroupError, IGroupUpdate>(GroupRoutes.GROUP, RestMethods.PUT, 'updateGroup')

export const useDeleteGroupMutation = () =>
  UseMutation<{ success: boolean }, IGroupError, IGroupDelete>(GroupRoutes.GROUP, RestMethods.DELETE, 'deleteGroup')

export const useAddPlayerToGroupMutation = () => UseMutation<IPlayer, {}, ICreatePlayer>(GroupRoutes.ADD_PLAYER, RestMethods.POST, 'addPlayerToGroup')

export const useAddUserToGroupMutation = () => UseMutation<IPlayer, {}, { userId: string }>(GroupRoutes.ADD_USER, RestMethods.POST, 'addUserToGroup')

