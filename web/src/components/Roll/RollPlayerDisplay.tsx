import { Center, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"
import { usePlayersSlice } from "../../stores/Players.slice"

export const RollPlayerDisplay: FC<{ playerId: string }> = ({ playerId }) => {
  const bgColor = useColorModeValue("gray.200", "gray.700")
  const textColor = useColorModeValue("gray.900", "gray.300")
  const player = usePlayersSlice(state => state.players.find(p => p.id === playerId))
  if (!player) return null

  return (
    <Center w="20" h="10" bg={bgColor}
      textColor={textColor} borderRadius="2" textShadow="light-lg">
      {player.name}
    </Center>
  )
}

