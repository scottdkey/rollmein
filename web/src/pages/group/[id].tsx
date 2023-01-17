import { Button, Center, Heading, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GroupForm } from "../../components/GroupForm";
import { RollType, useAddPlayerToGroupMutation, useAddUserToGroupMutation, useGroupQuery, useUserJoinGroupMutation } from "../../utils/groupApi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useWebSocket from "react-use-websocket";

import PlayerCards from "../../components/PlayerCards";
import { IGroup, IGroupWsResponse } from "../../types/Group";
import { GroupWSMessageTypes } from "../../types/GroupMessages.enum";

export enum WebsocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
  UNINSTANTIATED = 4,
}

export default function Group() {
  const router = useRouter()
  const params = router.query
  const id = params.id as string
  const { status, data: session } = useSession()
  const [players, setPlayers] = useState<string[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [group, setGroup] = useState<IGroup | undefined>(undefined)
  const { data, isLoading, isError, refetch } = useGroupQuery(id, id !== undefined)
  const addPlayerMutation = useAddPlayerToGroupMutation()
  const addMemberMutation = useAddUserToGroupMutation()
  const joinGroupMutation = useUserJoinGroupMutation()



  const { sendJsonMessage, readyState } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: (event) => {
      const parsedData: IGroupWsResponse = JSON.parse(event.data)
      if (Object.keys(event.data).length > 0 && parsedData.group) {
        const group = parsedData.group
        setGroup(group)
        setPlayers(group.relations.players)
        setMembers(group.relations.members)
      }
    },
    onOpen: () => {
      joinGroup()
    }

  })

  useEffect(() => {

    if (id) {
      refetch()
    }
    if (data) {
      setGroup(data)
    }
    const ready = readyStateHandler(readyState)

    if (session && session.id && id && ready) {
      openGroup()

    }
  }, [readyState, data, status, isLoading, id, group?.rollType, refetch])

  const openGroup = async () => {
    const message = {
      messageType: GroupWSMessageTypes.Open,
      sessionToken: session?.id,
      groupId: id
    }
    sendJsonMessage(message)
  }


  const joinGroup = async () => {
    await joinGroupMutation.mutateAsync({
      groupId: id
    })
  }

  const addPlayer = (player: ICreatePlayer) => {
    addPlayerMutation.mutateAsync(player, {
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }



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
  return (
    <>
      {JSON.stringify({
        members,
        players
      })}
      <Heading size={'xl'}>{group?.name}</Heading>
      <Heading size={'l'}>RollType: {group?.rollType === 'ffa' ? 'Free For All' : 'By Role'}</Heading>
      <GroupForm group={group} />
      <PlayerCards groupId={id} rollType={group?.rollType ? group.rollType : RollType.FFA} />
      <Button onClick={joinGroup}>Join Group</Button>
      <Button onClick={openGroup}>Open connect</Button>
    </>
  )
}

const readyStateHandler = (readyState: number) => {
  switch (readyState) {
    case WebsocketReadyState.CONNECTING:
      break
    case WebsocketReadyState.OPEN:
      return true
    case WebsocketReadyState.CLOSED:
      break
    case WebsocketReadyState.CLOSING:
      break
    case WebsocketReadyState.UNINSTANTIATED:
      break
    default:
      console.debug('unknown ready state for group websocket')
      break
  }
  return false
}