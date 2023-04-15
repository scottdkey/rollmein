import { Spinner, Text, VStack } from "@chakra-ui/react"
import { useGroupsQuery } from "../utils/groupApi"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { useEffect } from "react"




export const Groups = () => {
  const { data, isLoading, refetch } = useGroupsQuery()

  useEffect(() => {
    if (!isLoading && data === undefined) {
      refetch()
    }
  }, [data])


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

