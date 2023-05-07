import { Button, Center, HStack, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PlayerCards from "../../components/Player/PlayerCards";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GroupForm } from "../../components/Group/GroupForm";
import { useGroupSlice } from "../../stores/Group.slice";
import { GroupWsProvider } from "../../providers/GroupWebsocketProvider";
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice";
import Rolls from "../../components/Roll/Roll";


export default function Group() {
  const router = useRouter()
  const params = router.query
  const id = params.id as string
  const { data: session } = useSession()
  const setGroup = useCurrentGroupSlice(state => state.setGroup)

  const groups = useGroupSlice(state => state.groups)
  const group = useCurrentGroupSlice(state => state.group)
  const groupId = useCurrentGroupSlice(state => state.id)
  const name = useCurrentGroupSlice(state => state.name)




  useEffect(() => {
    if (session && !session.id) {
      router.push("/")
    }
    if (!session) {
      router.push('/')
    }
  }, [router, session])

  useEffect(() => {
    if (groups) {
      const group = groups.find(group => group.id === id)
      if (group) {
        setGroup(group)
      }
    }
  }, [groups])

  if (group) {
    return (
      <GroupWsProvider groupId={groupId}>
        <Center>
          <VStack>
            <HStack>
              <Heading size={'xl'}>{name}</Heading>
              <GroupForm group={group} />
            </HStack>
            <PlayerCards groupId={groupId} />
            <Button>Start Roll</Button>
            <Rolls />
          </VStack>
        </Center>
      </GroupWsProvider>
    )
  }
  return (
    <Heading>unknown error occurred</Heading>
  )
}