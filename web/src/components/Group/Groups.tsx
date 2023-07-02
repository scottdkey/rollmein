import { Spinner, Text, VStack } from "@chakra-ui/react"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { useGetGroups } from "../../utils/group.api"




export const Groups = () => {
  const { isLoading, data: groups } = useGetGroups()

  if (isLoading) {
    <Spinner />
  }
  if(groups){
    return (
      <VStack>
        <GroupForm />
        {groups.map((group, index) => <Group group={group} key={group.id + index} />)}
      </VStack>
    )
  }

  return <GroupForm />
}


