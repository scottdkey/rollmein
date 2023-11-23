import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons"
import React, { useEffect, useState } from "react"
import Dice from "../../assets/Dice"
import FirstAid from "../../assets/FirstAid"
import OpenLock from "../../assets/OpenLock"
import Lock from "../../assets/Lock"
import Sword from "../../assets/Sword"
import { IconWrapper } from "../IconWrapper"
import { Trash } from "../../assets/Trash"
import { useToast } from "@chakra-ui/react"
import { Shield } from "../../assets"
import { useGetPlayer, useUpdatePlayer } from "../../utils/player.api"
import { useAddPlayerToGroup } from "../../utils/group.api"
import { usePlayersSlice } from "../../stores/Players.slice"


interface PlayerCardProps {
  id?: string,
  userId?: string,
  rollType: string,
  groupId?: string
  profilePage: boolean
  closeCreate?: () => void
}
const PlayerCard = ({ id, userId, rollType = 'role', groupId, profilePage, closeCreate }: PlayerCardProps): JSX.Element => {
  const toast = useToast()

  const basePlayer = {
    userId: userId ? userId : "",
    //@ts-ignore
    id: id ? id : null,
    name: '',
    tank: false,
    healer: false,
    groupId: groupId ? groupId : "",
    dps: false,
    locked: false,
    inTheRoll: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const updatePlayer = useUpdatePlayer()
  const addPlayerToGroupMutation = useAddPlayerToGroup({
    groupId: groupId ? groupId : null,
  })
  const handlePlayerChange = usePlayersSlice(state => state.handlePlayerChange)

  //@ts-ignore
  const [player, setPlayer] = useState<IPlayer>(basePlayer)
  const { data: serverPlayerData } = useGetPlayer({
    playerId: id,
    enabled: id ? true : false

  })


  useEffect(() => {
    if (serverPlayerData) {
      setPlayer(serverPlayerData)
      setName(serverPlayerData.name)
    } else {
      resetCard()
    }
  }, [serverPlayerData])


  const [name, setName] = useState(basePlayer.name)
  const [editing, setEditing] = useState(id ? false : true)



  const handleSubmit = async () => {
    if (name.length >= 1 && editing) {
      if (name && id) {
        handleUpdatePlayer()
      }
      if (id === undefined) {
        handleCreatePlayer()
      }
    } else {
      toast({
        status: "error",
        title: "must include a name",
        isClosable: true,
      })
    }
  }

  const handleCreatePlayer = () => {
    const playerInput: ICreatePlayer = {
      ...player,
      name
    }
    addPlayerToGroupMutation.mutateAsync(playerInput)
  }

  const toggleEditing = () => {
    setEditing(!editing)
  }
  const resetCard = () => {
    closeCreate && closeCreate()
    //@ts-ignore
    setPlayer(basePlayer)
  }

  const handleUpdatePlayer = async () => {
    const playerInput = {
      ...player,
      name
    }

    if (id) {
      await updatePlayer.mutateAsync({ ...playerInput, id }, {
        onSuccess: async (data) => {
          if (data) {
            setPlayer(data)
            handlePlayerChange(data)
          }
          toggleEditing()
        },
        onError: (error) => {
          console.log('display this error', error)
        }
      })
    }
  }

  const updatePlayerField = async (field: string, changeValue: any) => {
    try {
      let playerInput = {
        ...player,
        [field]: changeValue
      }
      const { locked, healer, dps, tank, inTheRoll } = playerInput
      const hasRole = [dps, healer, tank].some(value => value === true)
      const isRoleField = [field === 'tank', field === 'dps', field === 'healer'].some(value => value === true)
      const roleIsRollType = rollType === 'role'

      if (locked && field === 'locked' && !hasRole && roleIsRollType) {
        toast({
          title: 'must have role if locking',
          description: "if player is locked, they must have a role",
          status: "warning",
          isClosable: true
        })
      }
      if (roleIsRollType && inTheRoll && !hasRole) {
        playerInput.inTheRoll = false
      }
      if (roleIsRollType && locked && !hasRole) {
        playerInput.locked = false
      }
      if (roleIsRollType && locked && hasRole) {
        playerInput.inTheRoll = true
      }
      if (locked === true && field === 'inTheRoll' && changeValue === false) {
        playerInput.inTheRoll = false
        playerInput.locked = false
      }
      if (roleIsRollType && inTheRoll && !hasRole && field === 'inTheRoll') {
        toast({
          title: 'must have a role',
          description: "in this type of role you have to have at least one active role to participate",
          status: "warning",
          isClosable: true
        })
      }

      if (isRoleField && inTheRoll && !hasRole) {
        toast({
          title: 'must have a role',
          description: "can't be in the roll and not a have a role",
          status: "warning",
          isClosable: true
        })
        playerInput = {
          ...playerInput,
          inTheRoll: true,
          [field]: !changeValue
        }
      }
      setPlayer(playerInput)

      if (id !== undefined) {
        const idPlayer = { ...playerInput, id }
        await updatePlayer.mutateAsync(idPlayer)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async () => {
    if (id) {
      console.log('handle delete')
    }
    if (id && player.groupId) {
      console.log('remove player from group')
    }
    if (id && player.userId && player.groupId === null) {
      toast({
        title: "delete card error",
        description: "unable to delete user default card",
        status: "error"

      })
    }
    if (id === undefined) {
      resetCard()
    }
  }

  return (
    <div onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSubmit()
      }
    }}>
      <div>
        <div className="center">
          {profilePage ? null : <IconWrapper color="yellow" selected={player.locked} Icon={player.locked ? Lock : OpenLock} onClick={() => updatePlayerField('locked', !player.locked)} />}
          {profilePage ? null : <IconWrapper color="teal" selected={player.inTheRoll} Icon={Dice} onClick={() => updatePlayerField('inTheRoll', !player.inTheRoll)} />}

          {!profilePage && editing ?
            <IconWrapper color="red" selected={true} Icon={Trash} onClick={handleDelete} />
            : null}
          <div>
            <IconWrapper onClick={editing ? handleSubmit : toggleEditing} color={editing ? "green" : "gray"} selected={editing} Icon={editing ? CheckCircleIcon : EditIcon} />
          </div>
        </div>
        <div className="center">
          {editing ?
            <input
              name="name"
              width='100%'
              placeholder="player name"
              value={name}
              onChange={(e) => {
                const value = e.target.value
                setName(value)
              }}
            />
            :
            <h1>{name}</h1>
          }
        </div>


        {rollType === "role" ?
          <div className="hStack">
            <IconWrapper selected={player.tank} color="blue" Icon={Shield} onClick={async () => {
              await updatePlayerField("tank", !player.tank)
            }} />
            <IconWrapper selected={player.dps} color="orange" Icon={Sword} onClick={async () => {
              await updatePlayerField("dps", !player.dps)
            }} />
            <IconWrapper selected={player.healer} color="green" Icon={FirstAid} onClick={async () => {
              await updatePlayerField("healer", !player.healer)

            }} />
          </div>
          :
          null
        }
      </div >
    </div >
  )
}



export default PlayerCard