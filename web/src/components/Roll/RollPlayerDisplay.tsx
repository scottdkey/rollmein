import { Center, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"

export const RollPlayerDisplay: FC<{ player: IPlayer }> = ({ player }) => {
  const bgColor = useColorModeValue("gray.200", "gray.700")
  const textColor = useColorModeValue("gray.900", "gray.300")
  return (
    <Center w="20" h="10" bg={bgColor}
      textColor={textColor} borderRadius="2" textShadow="light-lg">
      {player.name}
    </Center>)
}