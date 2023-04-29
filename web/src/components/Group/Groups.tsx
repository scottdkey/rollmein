import { Spinner, Text, VStack } from "@chakra-ui/react"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { useGroupSlice } from "../../stores/Group.slice"
import { useGetGroups } from "../../utils/group.api"




export const Groups = () => {
  const groups = useGroupSlice(state => state.groups)
  const { isLoading } = useGetGroups()



  if (groups && groups.length > 0) {
    return (
      <VStack>
        <GroupForm />
        {groups.map(group => <Group group={group} key={group.id} />)}
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


