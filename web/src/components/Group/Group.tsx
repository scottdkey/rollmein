import { DeleteIcon } from "@chakra-ui/icons"
import { Button, HStack, Heading, Spinner, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useDeleteGroup } from "../../utils/group.api"
import { useGetGroupPlayers } from "../../utils/player.api"
import { useGroupSlice } from "../../stores/Group.slice"
import { GroupForm } from "./GroupForm"
import { IGroup } from "../../types/Group"
import { useEffect, useState } from "react"


export const Group = (params: { group: IGroup }) => {
  const { status, data: session } = useSession()
  const router = useRouter()
  const groups = useGroupSlice(state => state.groups)
  const [group, setGroup] = useState<IGroup | undefined>(undefined)
  const toast = useToast()
  const deleteGroup = useDeleteGroup({
    onSuccess: () => { }
  })
  const { data: players, isLoading, isError } = useGetGroupPlayers({ groupId: params.group.id })

  useEffect(() => {
    if (params.group) {
      setGroup(groups.find(group => group.id === params.group.id))
    }
  }, [params.group, groups])


  const handleDelete = async () => {
    if (group) {
      await deleteGroup.mutate({
        groupId: group.id,
        sessionToken: session?.id
      })
      toast({
        title: "deleted record",
        isClosable: true,
        status: "info"

      })
    }
    toast({
      title: "Error, no group found to delete",
      isClosable: true,
      status: 'error'
    })
  }

  if (group && players) {
    return (
      <HStack>
        <Button variant={'solid'} colorScheme={'green'} disabled={status !== "authenticated"} onClick={async () => {
          await router.push(`/group/${group.id}`)
        }}>
          <HStack >
            <Heading>{group.name}</Heading>
            {isError}
            {isLoading ? <Spinner /> : <Heading size={'small'}> Players: {players.length}</Heading>}
          </HStack>
        </Button>
        <GroupForm group={group} />
        <Button onClick={handleDelete} disabled={status !== "authenticated"}><DeleteIcon /></Button>
      </HStack>
    )
  }
  return (
    <>
      Something went wrong, unable to load group info
    </>
  )
}