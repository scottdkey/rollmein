import { Spinner, Text, VStack } from "@chakra-ui/react"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { useGroupSlice } from "../../stores/Group.slice"
import { useGetGroups } from "../../utils/group.api"




export const Groups = () => {
  const groups = useGroupSlice(state => state.groups)
  const { isLoading } = useGetGroups()

  if (isLoading) {
    <Spinner />
  }
  return (
    <VStack>
      <GroupForm />
      {groups.map((group, index) => <Group group={group} key={group.id + index} />)}
    </VStack>
  )
}


