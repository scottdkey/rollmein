import { Button, Center, HStack, Heading, Spinner, VStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PlayerCards from "../../components/Player/PlayerCards";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GroupForm } from "../../components/Group/GroupForm";
import { useGroupSlice } from "../../stores/Group.slice";
import { useGetGroup } from "../../utils/group.api";
import { GroupWsProvider } from "../../providers/GroupWebsocketProvider";


export default function Group() {
  const router = useRouter()
  const params = router.query
  const id = params.id as string
  const { data: session } = useSession()

  const group = useGroupSlice(state => state.groups.find(group => group.id === id))
  const { isLoading } = useGetGroup({ groupId: id })

  useEffect(() => {
    if (session && !session.id) {
      router.push("/")
    }
    if (!session) {
      router.push('/')
    }
  }, [router, session])


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
      <GroupWsProvider groupId={group.id}>
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
      </GroupWsProvider>
    )
  }
  return (
    <Text>
      error occurred
    </Text>
  )
}