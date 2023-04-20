import { Button, Center, HStack, Heading, Spinner, VStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PlayerCards from "../../components/Player/PlayerCards";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GroupForm } from "../../components/Group/GroupForm";
import { useGroupSlice } from "../../components/Group/Group.slice";
import { useGetGroup } from "../../utils/group.api";



export default function Group() {
  const router = useRouter()
  const params = router.query
  const id = params.id as string
  const { data: session } = useSession()

  useEffect(() => {
    if (session && !session.id) {
      router.push("/")
    }
    if (!session) {
      router.push('/')
    }
  }, [router, session])

  if (id) {
    return (
      <>
        <GroupStructure groupId={id} />
      </>
    )
  }
  return (
    <>
      no group id
    </>
  )
}

const GroupStructure = ({ groupId }: { groupId: string }) => {
  const { data: session } = useSession()
  const group = useGroupSlice(state => state.group)
  const setGroup = useGroupSlice(state => state.setGroup)
  const { isLoading } = useGetGroup({
    onSuccess: (group) => {
      if (group) {
        setGroup(group)
      }
    },
    groupId,
    sessionToken: session?.id
  })


  if (isLoading) {
    return (
      <>
        <Center>
          <Spinner size='xl' color='teal.200' />
        </Center>
      </>
    )
  }

  if (group) {
    return (
      <Center>
        <VStack>
          <HStack>
            <Heading size={'xl'}>{group.name}</Heading>
            <GroupForm group={group} />
          </HStack>
          <PlayerCards groupId={group.id} />
          <Button>Start Roll</Button>
        </VStack>
      </Center>
    )
  }
  return (
    <Text>
      error occurred
    </Text>
  )

}