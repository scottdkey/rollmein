import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons"
import { border, Box, Center, Heading, HStack, Input, useColorModeValue } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import Dice from "../assets/Dice"
import FirstAid from "../assets/FirstAid"
import OpenLock from "../assets/OpenLock"
import Lock from "../assets/Lock"
import { Shield } from "../assets/Shield"
import Sword from "../assets/Sword"
import { IconWrapper } from "./IconWrapper"
import { Trash } from "../assets/Trash"
import { Player } from "@apiTypes/Player"
import { usePlayerQuery, useUpdatePlayerMutation } from "../utils/playerApi"
import { useToast } from "@chakra-ui/react"


interface PlayerCardProps {
  id?: string,
  userId?: string,
  rollType: string,
  groupId?: string
  profilePage: boolean
}
const PlayerCard = ({ id, userId, rollType = 'role', groupId, profilePage }: PlayerCardProps): JSX.Element => {
  const { data: playerQuery, error: playerQueryError, refetch } = usePlayerQuery(id)
  const playerMutation = useUpdatePlayerMutation({
    onSuccess: async () => {
      await refetch()
    }
  })
  const [player, setPlayer] = useState<Player>({
    id: id as string,
    userId: userId ? userId : "",
    name: '',
    tank: false,
    healer: false,
    groupId: groupId ? groupId : "",
    dps: false,
    locked: false,
    inTheRoll: false,
    createdAt: "",
    updatedAt: ""
  })
  const [name, setName] = useState(player?.name ? player.name : "")
  const [editing, setEditing] = useState(false)
  const textColor = useColorModeValue("gray.700", "gray:200")
  const primary = useColorModeValue(`gray.300`, `gray.600`)
  const inColor = useColorModeValue("teal.100", "teal.800")
  const lockedColor = useColorModeValue("yellow.500", "yellow.500")
  const background = player.inTheRoll && !profilePage ? inColor : primary
  const borderColor = !profilePage && player.locked ? lockedColor : "blackAlpha.100"
  const toast = useToast()

  useEffect(() => {
    if (playerQuery) {
      setPlayer(playerQuery)
      setName(playerQuery.name)
    }
    if (playerQueryError) {
      toast(playerQueryError)
    }

  }, [playerQuery?.data, playerQueryError])


  const handleSubmit = async () => {
    if (editing && name) {
      const playerInput = {
        ...player,
        id: player.id,
        tank: player.tank,
        dps: player.dps,
        healer: player.healer,
        locked: player.locked,
        inTheRoll: player.inTheRoll,
        name
      }
      setPlayer(playerInput)
      await playerMutation.mutateAsync(playerInput)
    }
    toggleEditing()

  }

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const updatePlayerField = async (field: string, changeValue: any) => {
    const playerInput = {
      ...player,
      [field]: changeValue
    }
    setPlayer(playerInput)
    await playerMutation.mutateAsync(playerInput)
  }
  const handleDelete = async () => {
    console.log('handle delete')
  }

  const handleEnterPressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSubmit()
    }
  }


  return (
    <Box borderColor={borderColor} borderRadius={"md"} padding={2} w="200px" h="100%" shadow="base" borderWidth="10px" bg={background} position="relative" justifyContent="center" alignItems="center" onKeyPress={handleEnterPressed}>
      <Box position="relative">
        <Center>
          {profilePage ? null : <IconWrapper color="yellow" selected={player.locked} Icon={player.locked ? Lock : OpenLock} onClick={() => updatePlayerField('locked', !player.locked)} />}
          {profilePage ? null : <IconWrapper color="teal" selected={player.inTheRoll} Icon={Dice} onClick={() => updatePlayerField('inTheRoll', !player.inTheRoll)} />}

          {!profilePage && editing ?
            <IconWrapper color="red" selected={true} Icon={Trash} onClick={handleDelete} />
            : null}
          <Box ml='auto'>
            <IconWrapper onClick={handleSubmit} color={editing ? "green" : "gray"} selected={editing} Icon={editing ? CheckCircleIcon : EditIcon} />
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