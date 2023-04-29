import { DeleteIcon } from "@chakra-ui/icons"
import { Button, HStack, Heading, useToast } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useDeleteGroup, useGetGroup } from "../../utils/group.api"
import { useGetGroupPlayers } from "../../utils/player.api"
import { useGroupSlice } from "./Group.slice"
import { GroupForm } from "./GroupForm"
import { IGroup } from "../../types/Group"


export const Group = (params: { group: IGroup }) => {
  const { status, data: session } = useSession()
  const router = useRouter()
  const groups = useGroupSlice(state => state.groups)
  const group = useGroupSlice(state => state.groups.find(g => g.id === params.group?.id))
  const setGroups = useGroupSlice(state => state.setGroups)
  const toast = useToast()
  const deleteGroup = useDeleteGroup({
    onSuccess: () => { }
  })
  const { data: players } = useGetGroupPlayers({
    onSuccess: (_) => {
      setGroups(groups)
    },
    groupId: params.group.id,
    sessionToken: session?.id
  })
  const { isLoading } = useGetGroup({
    onSuccess: (gr) => {
      if (gr && group) {
        const newGroups = groups.map(g => {
          if (g.id === gr.id) {
            return gr
          }
          return g
        })
        setGroups(newGroups)
      }
      if (gr && !group) {
        setGroups([...groups, gr])
      }
    },
    groupId: params.group.id,
    sessionToken: session?.id
  })


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

  if (isLoading) {
    return (
      <>
        loading
      </>
    )
  }

  if (group) {
    return (
      <HStack>
        <Button variant={'solid'} colorScheme={'green'} disabled={status !== "authenticated"} onClick={async () => {
          await router.push(`/group/${group.id}`)
        }}>
          <HStack >
            <Heading>{group.name}</Heading>
            <Heading size={'small'}> Players: {players?.length}</Heading>
          </HStack>
        </Button>
        <GroupForm group={group} />
        <Button onClick={handleDelete} disabled={status !== "authenticated"}><DeleteIcon /></Button>
      </HStack>
    )
  }
  return (
    <>
      Somethign went wrong, unable to load group info
    </>
  )
}