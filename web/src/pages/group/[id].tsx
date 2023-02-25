import { Center, HStack, Heading, Spinner, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GroupForm } from "../../components/GroupForm";
import { useAddPlayerToGroupMutation, useGroupQuery } from "../../utils/groupApi";


import PlayerCards from "../../components/PlayerCards";
import { GroupWsProvider } from "../../providers/GroupWebsocketProvider";
import { useEffect } from "react";
import { usePlayerFromSignedInUserQuery } from "../../utils/playerApi";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";



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
      <GroupWsProvider groupId={id}>
        <GroupStructure groupId={id} />
      </GroupWsProvider>
    )
  }
  return (
    <>
      no group id
    </>
  )
}

const GroupStructure = ({ groupId }: { groupId: string }) => {
  const { data, isLoading, isError } = useGroupQuery(groupId, true)

  if (isLoading) {
    return (
      <>
        <Center>
          <Spinner size='xl' color='teal.200' />
        </Center>
      </>
    )
  }
  if (isError) {
    return (
      <>
        error occurred
      </>
    )
  }

  if (data) {
    return (
      <Center>
        <VStack>
          <HStack>
            <Heading size={'xl'}>{data.name}</Heading>
            <GroupForm group={data} />
          </HStack>
          <PlayerCards />
        </VStack>
      </Center>
    )
  }
  return (
    <>
      error occurred
    </>
  )

}