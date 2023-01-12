import { Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GroupForm } from "../../components/GroupForm";
import { GroupWSMessageTypes, RollType, useAddPlayerToGroupMutation, useAddUserToGroupMutation, useGroupQuery } from "../../utils/groupApi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useWebSocket from "react-use-websocket";
import { IGroup, IGroupWs } from "../../../../api/src/types/Group";
import { ICreatePlayer } from "../../../../api/src/types/Player";
import PlayerCards from "../../components/PlayerCards";


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
  const { data, isLoading, isError, refetch } = useGroupQuery(id)
  const addPlayerMutation = useAddPlayerToGroupMutation()
  const addMemberMutation = useAddUserToGroupMutation()



  const { sendJsonMessage, readyState } = useWebSocket(`${process.env.NEXT_PUBLIC_API_WS}`, {
    onMessage: (event) => {
      const parsedData: IGroupWs = JSON.parse(event.data)
      if (Object.keys(event.data).length > 0 && parsedData.group) {
        const group = parsedData.group
        setGroup(group)
        setPlayers(group.relations.players)
        setMembers(group.relations.members)
      }
    }
  })

  useEffect(() => {

    if (id) {
      refetch()
    }
    if (data) {
      setGroup(data)
    }
    readyStateHandler(readyState)
  }, [readyState, data, status, isLoading, id, group?.rollType])



  const sendBaseMessage = async () => {
    if (session?.id && id) {
      sendJsonMessage({
        sessionToken: session.id,
        groupId: id,
        members: JSON.stringify(members),
        players: JSON.stringify(players),
        messageType: GroupWSMessageTypes.ADD_MEMBER
      })
    }

  }

  const addPlayer = (player: ICreatePlayer) => {
    addPlayerMutation.mutateAsync(player, {
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }
  const addUser = (userId: string) => {
    addMemberMutation.mutateAsync({
      userId
    }, {
      onSuccess: (data) => {
        if (data) {
          console.log(data)
        }

      }
    })
  }


  if (isLoading) {
    return (
      <>
        loading
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
      <Button onClick={sendBaseMessage}>Send base message</Button>
      <Button onClick={() => {
        addPlayer({
          name: "",
          groupId: id,
          userId: null,
          tank: false,
          healer: false,
          dps: false,
          locked: false,
          inTheRoll: false
        })
      }}>Add Player</Button>
      <Button onClick={() => {
        if (session?.user.id) {
          addUser(session.user.id)
        }
      }}>Add User</Button>
    </>
  )
}

const readyStateHandler = async (readyState: number) => {
  switch (readyState) {
    case WebsocketReadyState.CONNECTING:
      console.info("connecting")
      break
    case WebsocketReadyState.OPEN:
      console.info('open')
      break
    case WebsocketReadyState.CLOSED:
      console.debug('closed')
      break
    case WebsocketReadyState.CLOSING:
      console.debug('closing')
      break
    case WebsocketReadyState.UNINSTANTIATED:
      console.debug('uninstantiated ws')
      break
    default:
      console.debug('unknown ready state for group websocket')
      break
  }
}