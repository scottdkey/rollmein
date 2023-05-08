import { Button, Center, HStack, Heading, Skeleton, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PlayerCards from "../../components/Player/PlayerCards";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { GroupForm } from "../../components/Group/GroupForm";
import { GroupWsProvider } from "../../providers/GroupWebsocketProvider";
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice";
import Rolls from "../../components/Roll/Roll";
import { useGetGroup } from "../../utils/group.api";

export default function Group() {
  const router = useRouter()
  const params = router.query
  const id = params.id as string
  const { status } = useSession()
  const group = useCurrentGroupSlice(state => state.group)
  const groupId = useCurrentGroupSlice(state => state.id)
  const name = useCurrentGroupSlice(state => state.name)
  const { isLoading, refetch } = useGetGroup({ groupId: id === "" ? groupId : id })



  useEffect(() => {
    if (group === null) {
      refetch()
    }
  }, [group, refetch, status])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }

  }, [router, status])



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
            {/* <Button>Start Roll</Button> */}
            <Rolls />
          </VStack>
        </Center>
      </GroupWsProvider>
    )
  }

  if (isLoading) {
    return (
      <Skeleton />
    )
  }

  if (!isLoading && !group) {
    return (
      <Skeleton />
    )
  }

  return null
}