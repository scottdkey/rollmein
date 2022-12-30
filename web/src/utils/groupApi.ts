import { UseMutationOptions, useQuery } from "react-query"
import { ApiRequest, Mutation } from "./Rollmein.api"
import { ICreateGroup, IGroup, IGroupDelete, IGroupError, IGroupUpdate } from "../../../types/Group"
import { GroupRoutes } from "../../../types/Group.enum"
import { RestMethods } from "../types/RestMethods.enum"
import { useSession } from "next-auth/react"




export const useGroupsQuery = () => {
  const { data: session } = useSession()
  return useQuery<IGroup[], IGroupError>(GroupRoutes.GROUP, async () => {
    return await ApiRequest<{}, IGroup[]>(GroupRoutes.GROUP, RestMethods.GET, {sessionToken: session?.id})
  })
}

export const useGroupQuery = (groupId: string) => {
  const {data: session} = useSession()
  return useQuery<IGroup, IGroupError>({
    queryKey: `${GroupRoutes.GROUP}-${groupId}`,
    queryFn: () => {
      return ApiRequest<{}, IGroup>(`${GroupRoutes.GROUP}/${groupId}`, RestMethods.GET, {sessionToken: session?.id})

    }
  })
}

export const useCreateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, ICreateGroup>) => Mutation(options, GroupRoutes.GROUP, RestMethods.POST)


export const useUpdateGroupMutation = (options: UseMutationOptions<IGroup, IGroupError, IGroupUpdate>) => Mutation(options, GroupRoutes.GROUP, RestMethods.PUT)

export const useDeleteGroupMutation = (options: UseMutationOptions<{ success: boolean }, IGroupError, IGroupDelete>) =>
  Mutation(options, GroupRoutes.GROUP, RestMethods.DELETE)

