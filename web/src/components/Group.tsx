import { DeleteIcon } from "@chakra-ui/icons"
import { HStack, Heading, Button } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { GroupRoutes, IGroup, useDeleteGroupMutation, useGroupQuery } from "../utils/groupApi"
import { GroupForm } from "./GroupForm"
import { Tooltip } from '@chakra-ui/react'
import { useQueryClient } from "react-query"
import { useAuth } from "../providers/AuthProvider"


export const Group = ({ group }: { group: IGroup }) => {

  const router = useRouter()
  const playerCount = group.players ? group.players.length : 0

  const { data, isLoading } = useGroupQuery(group.id)
  const { auth } = useAuth()
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteGroupMutation({
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: [GroupRoutes.GROUP]
      })
    }
  })


  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ id: group.id })
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
        <Button variant={'solid'} colorScheme={'green'} disabled={!auth} onClick={async () => {
          await router.push(`/group/${data ? data.id : group.id}`)
        }}>
          <HStack >
            <Heading>{data ? data.name : group.name}</Heading>
            <Heading size={'small'}> Players: {playerCount}</Heading>
          </HStack>
        </Button>
      <GroupForm group={data} />
      <Button onClick={handleDelete} disabled={!auth}><DeleteIcon /></Button>

    </HStack>
  )
}