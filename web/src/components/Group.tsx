import { DeleteIcon } from "@chakra-ui/icons"
import { HStack, Heading, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GroupRoutes, useDeleteGroupMutation, useGroupQuery } from "../utils/groupApi"
import { GroupForm } from "./GroupForm"
import { Tooltip } from '@chakra-ui/react'
import { useQueryClient } from "react-query"
import { useSession } from "next-auth/react"


export const Group = ({ group }: { group: IGroup }) => {
  const { status } = useSession()
  const router = useRouter()
  const playerCount = group.relations.players ? group.relations.players.length : 0

  const { data, isLoading } = useGroupQuery(group.id)

  const queryClient = useQueryClient()
  const deleteMutation = useDeleteGroupMutation()


  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: group.id }, {
      onSuccess: async (data) => {
        await queryClient.refetchQueries({
          queryKey: [GroupRoutes.GROUP]
        })
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

  return (
    <HStack>
      <Button variant={'solid'} colorScheme={'green'} disabled={status !== "authenticated"} onClick={async () => {
        await router.push(`/group/${data ? data.id : group.id}`)
      }}>
        <HStack >
          <Heading>{data ? data.name : group.name}</Heading>
          <Heading size={'small'}> Players: {playerCount}</Heading>
        </HStack>
      </Button>
      <GroupForm group={data} />
      <Button onClick={handleDelete} disabled={status !== "authenticated"}><DeleteIcon /></Button>

    </HStack>
  )
}