import { useMutation, UseMutationOptions, useQuery } from "react-query"
import { ApiRequest, Mutation, RestMethods } from "./Rollmein.api"


export interface IGroupError {
  response: {
    status: number
  }
}

export enum GroupRoutes {
  GROUP = "group"
}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}

export interface ICreateGroup {
  name: string,
  rollType: RollType
  membersCanUpdate: boolean
  lockAfterOut: boolean
}

export interface IGroup extends ICreateGroup {
  id: string
  userId: string
  players: string[]
  members: string[]
  createdAt: string
  updatedAt: string
}

export interface IGroupUpdate {
  id: string,
  membersCanUpdate?: boolean,
  rollType?: RollType,
  lockAfterOut?: boolean,
  memberId?: string,
  playerId?: string
}

interface IGroupDelete {
  id: string
}

export const useGroupsQuery = () => {
  return useQuery<IGroup[], IGroupError>(GroupRoutes.GROUP, async () => {
    return await ApiRequest<{}, IGroup[]>(GroupRoutes.GROUP, RestMethods.GET)
  })
}

export const useGroupQuery = (groupId: string) => {
  return useQuery<IGroup, IGroupError>({
    queryKey: `${GroupRoutes.GROUP}-${groupId}`,
    queryFn: () => {
      return ApiRequest<{}, IGroup>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET)

    }
  })
}

export const useCreateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, ICreateGroup>) => Mutation(options, GroupRoutes.GROUP, RestMethods.POST)


export const useUpdateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, IGroupUpdate>) => Mutation(options, GroupRoutes.GROUP, RestMethods.PUT)

export const useDeleteGroupMutation = (options: UseMutationOptions<{ success: boolean }, IGroupError, IGroupDelete>) =>
  Mutation(options, GroupRoutes.GROUP, RestMethods.DELETE)

