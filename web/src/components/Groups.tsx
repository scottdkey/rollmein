import { Spinner, Text, Tooltip, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { GroupRoutes, useGroupsQuery } from "../utils/groupApi"
import { ApiRequest } from "../utils/Rollmein.api"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { RestMethods } from "../types/RestMethods.enum"
import { useSession } from "next-auth/react"
import { IGroup } from "@apiTypes/Group"




export const Groups = () => {
  const { data, isLoading } = useGroupsQuery()
  const {data: session} = useSession()
  const queryClient = useQueryClient()

  useEffect(() => {
    if(data && data?.length > 0){
      data?.forEach(group => {
        queryClient.prefetchQuery({
          queryKey: `${GroupRoutes.GROUP}-${group.id}`,
          queryFn: () => {
            return ApiRequest<{}, IGroup>(`${GroupRoutes.GROUP}/${group.id}`, RestMethods.GET, { sessionToken: session?.id })

          }
        })
      })
    }
  }, [data, queryClient, session?.id])

  if (data) {
    return (
      <VStack>
        <GroupForm />
        {data.length > 0 ? data.map(group =>
          <Group group={group} key={group.id} />) :
          <Text>No Group data found</Text>}

      </VStack>
    )
  }
  if (isLoading) {
    <Spinner />
  }
  return (
    <VStack>
      <GroupForm />
      <Text>
        No Group data found
      </Text>

    </VStack>
  )
}

