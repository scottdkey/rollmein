import { DeleteIcon } from "@chakra-ui/icons"
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
      console.log('present to user', {
        title: "deleted record",
        isClosable: true,
        status: "info"

      })
    }
    console.log('present to user', {
      title: "Error, no group found to delete",
      isClosable: true,
      status: 'error'
    })
  }

  if (group && players) {
    return (
      <div className="hStack">
        <button onClick={async () => {
          await router.push(`/group/${group.id}`)
        }}>
          <div className="hStack" >
            <h1>{group.name}</h1>
            {isError}
            {isLoading ? <div className="spinner" /> : <h3> Players: {players.length}</h3>}
          </div>
        </button>
        <GroupForm group={group} />
        <button onClick={handleDelete} disabled={status !== "authenticated"}><DeleteIcon /></button>
      </div>
    )
  }
  return (
    <>
      Something went wrong, unable to load group info
    </>
  )
}