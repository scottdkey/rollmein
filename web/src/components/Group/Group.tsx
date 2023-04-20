import { DeleteIcon } from "@chakra-ui/icons"
import { HStack, Heading, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GroupRoutes, getGroup, useDeleteGroup, useGetGroup } from "../../utils/group.api"
import { GroupForm } from "./GroupForm"
import { Tooltip } from '@chakra-ui/react'
import { useQueryClient } from "react-query"
import { useSession } from "next-auth/react"
import { IGroup } from "../../types/Group"
import { useGroupSlice } from "./Group.slice"
import { useGetGroupPlayers } from "../../utils/player.api"


export const Group = (data: { group: IGroup }) => {
  const { status, data: session } = useSession()
  const router = useRouter()
  const setGroup = useGroupSlice(state => state.setGroup)
  const deleteGroup = useDeleteGroup({
    onSuccess: () => { }
  })
  const { data: players } = useGetGroupPlayers({
    onSuccess: (_) => {},
    groupId: data.group.id,
    sessionToken: session?.id
  })
  const { isLoading } = useGetGroup({
    onSuccess: (group) => {
      if (group) {
        setGroup(group)
      }
    },
    groupId: data.group.id,
    sessionToken: session?.id
  })


  const handleDelete = async () => {
    await deleteGroup.mutate({
       groupId: data.group.id,
      sessionToken: session?.id
    })
  }

  if (isLoading) {
    return (
      <>
        loading
      </>
    )
  }

  return (
    <HStack>
      <Button variant={'solid'} colorScheme={'green'} disabled={status !== "authenticated"} onClick={async () => {
        await router.push(`/group/${data.group.id}`)
      }}>
        <HStack >
          <Heading>{data.group.name}</Heading>
          <Heading size={'small'}> Players: {players?.length}</Heading>
        </HStack>
      </Button>
      <GroupForm group={data.group} />
      <Button onClick={handleDelete} disabled={status !== "authenticated"}><DeleteIcon /></Button>

    </HStack>
  )
}