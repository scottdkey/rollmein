import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Center, Heading, HStack, Input, useColorModeValue } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Dice from "../assets/Dice"
import FirstAid from "../assets/FirstAid"
import OpenLock from "../assets/OpenLock"
import Lock from "../assets/Lock"
import Sword from "../assets/Sword"
import { IconWrapper } from "./IconWrapper"
import { Trash } from "../assets/Trash"
import { ICreatePlayer, IPlayer } from "@apiTypes/Player"
import { useCreatePlayerMutation, usePlayerQuery, useUpdatePlayerMutation } from "../utils/playerApi"
import { useToast } from "@chakra-ui/react"
import { useQueryClient } from "react-query"
import { Shield } from "../assets"
import { useAddPlayerToGroupMutation } from "../utils/groupApi"


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
  const { data: playerQuery, error: playerQueryError, refetch } = usePlayerQuery(id)
  const queryClient = useQueryClient()
  const playerMutation = useUpdatePlayerMutation()
  const addPlayerToGroupMutation = useAddPlayerToGroupMutation()
  const createPlayerMutation = useCreatePlayerMutation()

  const basePlayer = {
    userId: userId ? userId : "",
    name: '',
    tank: false,
    healer: false,
    groupId: groupId ? groupId : "",
    dps: false,
    locked: false,
    inTheRoll: false,
  }

  const [player, setPlayer] = useState<ICreatePlayer>(basePlayer)
  const [name, setName] = useState(playerQuery?.name ? playerQuery.name : "")
  const [editing, setEditing] = useState(id ? false : true)
  const textColor = useColorModeValue("gray.700", "gray:200")
  const primary = useColorModeValue(`gray.300`, `gray.600`)
  const inColor = useColorModeValue("teal.100", "teal.800")
  const lockedColor = useColorModeValue("yellow.500", "yellow.500")
  const background = player.inTheRoll && !profilePage ? inColor : primary
  const borderColor = !profilePage && player.locked ? lockedColor : "blackAlpha.100"

  useEffect(() => {
    if(playerQuery){
      setPlayer(playerQuery)
    }

  }, [playerQuery])

  const handleSubmit = async () => {

    if (name.length >= 1) {
      if (editing && name && id) {
        handleUpdatePlayer()
      }
      if (editing && id === undefined) {
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
    console.log({
      groupId,
      userId
    })
    const playerInput = {
      ...player,
      name
    }
    setPlayer(playerInput)
    closeCreate && closeCreate()
    if (groupId) {
      console.log(`todo also update group ${groupId}`)
    }
    addPlayerToGroupMutation.mutateAsync(playerInput, {
      onSuccess: (data) => {
        if (data) {
          setPlayer(data)
        }
      }
    })

  }

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const handleUpdatePlayer = async () => {
    const playerInput = {
      ...player,
      name
    }
    setPlayer(playerInput)
    if (id) {
      await playerMutation.mutateAsync({ ...playerInput, id }, {
        onSuccess: async (data) => {
          if (data) {
            setPlayer(data)
          }
          await refetch()
          if (userId) {
            await queryClient.refetchQueries("user/player")
          }
          toggleEditing()
        },
        onError: (error) => {
          toast({
            status: "error",
            description: error,
            title: "error updating player"

          })
        }
      })
    }
  }

  const updatePlayerField = async (field: string, changeValue: any) => {
    const playerInput = {
      ...player,
      [field]: changeValue
    }
    setPlayer(playerInput)
    if (id) {
      await playerMutation.mutateAsync({ ...playerInput, id })
    }
  }
  const handleDelete = async () => {
    if (id) {
      console.log('handle delete')
    }
    if (id === undefined) {
      console.log("clear card")
      closeCreate && closeCreate()
    }
  }


  return (
    <Box borderColor={borderColor} borderRadius={"md"} padding={2} w="240px" h="180px" shadow="base" borderWidth="10px" bg={background} position="relative" justifyContent="center" alignItems="center" onKeyPress={(e) => {
      if (e.key === "Enter") {
        handleSubmit()
      }
    }}>
      <Box position="relative">
        <Center>
          {profilePage ? null : <IconWrapper color="yellow" selected={player.locked} Icon={player.locked ? Lock : OpenLock} onClick={() => updatePlayerField('locked', !player.locked)} />}
          {profilePage ? null : <IconWrapper color="teal" selected={player.inTheRoll} Icon={Dice} onClick={() => updatePlayerField('inTheRoll', !player.inTheRoll)} />}

          {!profilePage && editing ?
            <IconWrapper color="red" selected={true} Icon={Trash} onClick={handleDelete} />
            : null}
          <Box ml='auto'>
            <IconWrapper onClick={editing ? handleSubmit : toggleEditing} color={editing ? "green" : "gray"} selected={editing} Icon={editing ? CheckCircleIcon : EditIcon} />
          </Box>
        </Center>
        <Center padding="4" color={useColorModeValue("gray.100", "gray.200")}>
          {editing ?
            <Input
              name="name"
              textAlign="center"
              fontSize="xl"
              width='100%'
              h='8'
              textShadow="2xl"
              textColor={textColor}
              fontWeight="800"
              placeholder="player name"
              value={name}
              size="sm"
              onChange={(e) => setName(e.target.value)}
            >
            </Input>
            :
            <Heading
              textColor={textColor}
              textShadow="2xl"
              fontSize="xl"
              h='8'
              width="100%"
              textAlign="center"
              justifyContent="center"
              alignContent="center">{
                player.name}
            </Heading>
          }
        </Center>


        {rollType === "role" ?
          <HStack align="center" justify="center">
            <IconWrapper selected={player.tank} color="blue" Icon={Shield} onClick={async () => {
              await updatePlayerField("tank", !player.tank)
            }} />
            <IconWrapper selected={player.dps} color="orange" Icon={Sword} onClick={async () => {
              await updatePlayerField("dps", !player.dps)
            }} />
            <IconWrapper selected={player.healer} color="green" Icon={FirstAid} onClick={async () => {
              await updatePlayerField("healer", !player.healer)

            }} />
          </HStack>
          :
          null
        }

      </Box >
    </Box >
  )
}



export default PlayerCard