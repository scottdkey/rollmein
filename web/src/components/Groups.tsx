import { Spinner, Text, Tooltip, VStack } from "@chakra-ui/react"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { GroupRoutes, IGroup, useGroupsQuery } from "../utils/groupApi"
import { ApiRequest, RestMethods } from "../utils/Rollmein.api"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"




export const Groups = () => {
  const { data, isLoading } = useGroupsQuery()
  const queryClient = useQueryClient()

  useEffect(() => {
    data?.forEach(group => {
      queryClient.prefetchQuery({
        queryKey: `${GroupRoutes.GROUP}-${group.id}`,
        queryFn: () => {
          return ApiRequest<{}, IGroup>(`${GroupRoutes.GROUP}/${group.id}`, RestMethods.GET)

        }
      })
    })
  }, [data, queryClient])

  if (data) {
    return (
      <VStack>
        <GroupForm />
        {data.length > 0 ? data.map(group =>
          <Tooltip label="stuff" key={group.id}>
            <Group group={group} />
          </Tooltip>) :
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

