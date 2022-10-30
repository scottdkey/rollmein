import { UseMutationOptions, useQuery } from "react-query"
import { ApiRequest, Mutation, RestMethods } from "./Rollmein.api"


interface IGroupError {
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

interface IGroupUpdate {
  membersCanUpdate?: boolean,
  rollType?: RollType,
  lockAfterOut?: boolean,
  memberId?: string,
  playerId?: string
}

interface IGroupDelete {
  id: string
}

export const useGroupsQuery = () => useQuery<IGroup[], IGroupError>("groups", async () => {
  return await ApiRequest<{}, IGroup[]>(GroupRoutes.GROUP, RestMethods.GET)
})

export const useGetGroupByIdQuery = (groupId: string) => useQuery<IGroup, IGroupError>(GroupRoutes.GROUP, async () => {
  return await ApiRequest<{}, IGroup>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET)
})

export const useCreateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, ICreateGroup>) =>
  Mutation(options, GroupRoutes.GROUP, RestMethods.POST)

export const useUpdateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, IGroupUpdate>) =>
  Mutation(options, GroupRoutes.GROUP, RestMethods.PUT)

export const useDeleteGroupMutation = (options: UseMutationOptions<{ success: boolean }, IGroupError, IGroupDelete>) =>
  Mutation(options, GroupRoutes.GROUP, RestMethods.DELETE)

