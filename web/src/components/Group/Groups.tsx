import { Spinner, Text, VStack } from "@chakra-ui/react"
import { Group } from "./Group"
import { GroupForm } from "./GroupForm"
import { useEffect } from "react"
import { useGroupSlice } from "./Group.slice"
import { useSession } from "next-auth/react"
import { useGetGroups } from "../../utils/group.api"




export const Groups = () => {
  const groups = useGroupSlice(state => state.groups)
  const setGroups = useGroupSlice(state => state.setGroups)
  const { data: session } = useSession()
  const { isLoading } = useGetGroups({
    onSuccess: (groups) => {
      setGroups(groups)
    },
    sessionToken: session?.id
  })



  if (groups && groups.length > 0) {
    return (
      <VStack>
        <GroupForm />
        {groups.map(group => { <Group group={group} key={group.id} /> }
        )}
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


