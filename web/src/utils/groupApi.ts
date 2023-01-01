import { UseMutationOptions, UseQueryOptions } from "react-query"
import { UseQuery, UseMutation } from "./Rollmein.api"
import { RestMethods } from "../types/RestMethods.enum"
import { ICreateGroup, IGroup, IGroupDelete, IGroupError, IGroupUpdate } from "@apiTypes/Group"


export enum GroupRoutes {
  GROUP = "group"
}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}

export const useGroupsQuery = () => {
  return UseQuery<IGroup[], {}>(GroupRoutes.GROUP, {
    queryKey: GroupRoutes.GROUP
  })
}

export const useGroupQuery = (groupId: string) => {
  const route = `${GroupRoutes.GROUP}/${groupId}`
  const options: UseQueryOptions<IGroup, {}> = {
    queryKey: `${GroupRoutes.GROUP}-${groupId}`
  }
  return UseQuery(route, options)
}

export const useCreateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, ICreateGroup>) => UseMutation(GroupRoutes.GROUP, RestMethods.POST, options)


export const useUpdateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, IGroupUpdate>) => UseMutation(GroupRoutes.GROUP, RestMethods.PUT, options)

export const useDeleteGroupMutation = (options: UseMutationOptions<{ success: boolean }, IGroupError, IGroupDelete>) =>
  UseMutation(GroupRoutes.GROUP, RestMethods.DELETE, options)

