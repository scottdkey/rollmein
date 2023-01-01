import { CheckCircleIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Center, Heading, HStack, Input, useColorModeValue } from "@chakra-ui/react"
import React, { useState } from "react"
import Dice from "../assets/Dice"
import FirstAid from "../assets/FirstAid"
import OpenLock from "../assets/OpenLock"
import Lock from "../assets/Lock"
import { Shield } from "../assets/Shield"
import Sword from "../assets/Sword"
import { IconWrapper } from "./IconWrapper"
import { Trash } from "../assets/Trash"
import { Player } from "@apiTypes/Player"

interface PlayerCardProps {
  id?: string,
  userId?: string,
  rollType: string,
  groupId?: string
}
const PlayerCard = ({ id, userId, rollType = 'role', groupId }: PlayerCardProps): JSX.Element => {
  const [player, setPlayer] = useState<Player>({
    id: id as string,
    userId: userId ? userId : "",
    name: '',
    tank: false,
    healer: false,
    groupId: groupId ? groupId : "",
    dps: false,
    locked: false,
    inTheRoll: false
  })
  const [name, setName] = useState(player?.name ? player.name : "")
  const [editing, setEditing] = useState(false)
  const textColor = useColorModeValue("gray.700", "gray:200")
  const primary = useColorModeValue(`gray.300`, `gray.600`)
  const inColor = useColorModeValue("teal.100", "teal.800")
  const lockedColor = useColorModeValue("yellow.500", "yellow.500")
  const background = player.inTheRoll ? inColor : primary


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
      console.log('player input', playerInput)
    }
    toggleEditing()

  }

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const updatePlayerField = async (field: string, changeValue: any) => {
    setPlayer({ ...player, [field]: changeValue })
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
    <Box borderColor={player.locked ? lockedColor : "blackAlpha.100"} borderRadius={"md"} padding={2} w="200px" h="100%" shadow="base" borderWidth="10px" bg={background} position="relative" justifyContent="center" alignItems="center" onKeyPress={handleEnterPressed}>
      <Box position="relative">
        <Center>
          <IconWrapper color="yellow" selected={player.locked} Icon={player.locked ? Lock : OpenLock} onClick={() => updatePlayerField('locked', !player.locked)} />
          <IconWrapper color="teal" selected={player.inTheRoll} Icon={Dice} onClick={() => updatePlayerField('inTheRoll', !player.inTheRoll)} />
          {userId === undefined && editing ?
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
            <IconWrapper selected={player.tank} color="blue" Icon={Shield} onClick={() => updatePlayerField("tank", !player.tank)} />
            <IconWrapper selected={player.dps} color="orange" Icon={Sword} onClick={() => updatePlayerField("dps", !player.dps)} />
            <IconWrapper selected={player.healer} color="green" Icon={FirstAid} onClick={() => updatePlayerField("healer", !player.healer)} />
          </HStack>
          :
          null
        }

      </Box >
    </Box >
  )
}



export default PlayerCard