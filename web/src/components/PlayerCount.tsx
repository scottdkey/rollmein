import { Circle, effect, Flex, Heading, HStack, Icon, useColorModeValue, VStack } from "@chakra-ui/react"
import React, { FC, useLayoutEffect, useState } from "react"
import { Lock, Dice, Shield, Sword, FirstAid } from "../assets"
import { client } from "../lib/clients/graphqlRequestClient"
import { PlayerCounts, roll } from "../utils/rollHelpers"



const PlayerCount = ({ }) => {

  const [currentCounts, setCurrentCounts] = useState({ locked: 0, inTheRoll: 0, tanks: 0, dps: 0, healers: 0 })
  const [rollType, setRollType] = useState('roll')



  type CountItemType = {
    count?: number
    icon: typeof Icon
    color: string
  }
  const CountItem: FC<CountItemType> = ({ count = 0, icon, color }: CountItemType): JSX.Element => {
    const themeColor = useColorModeValue(`${color}.500`, `${color}.600`)
    const glowColor = useColorModeValue("#FFFFFF", `#000000`)
    return (
      <Flex justify="center" align="center" >
        <Circle fontSize="xl" position="absolute" zIndex="1" textShadow={`0 0 3px ${glowColor}, 0 0 5px ${glowColor}`}>{count}</Circle>
        <Icon as={icon} color={themeColor} opacity="70%" w="10" h="10" />
      </Flex>
    )
  }

  return (
    <VStack>
      <Heading size="sm">Players</Heading>
      <HStack align="center" justify="center" position="relative">
        <CountItem count={currentCounts.locked} icon={Lock} color="yellow" />
        <CountItem count={currentCounts.inTheRoll} icon={Dice} color="teal" />
        {rollType === "role" ? <>
          <CountItem count={currentCounts.tanks} icon={Shield} color="blue" />
          <CountItem count={currentCounts.dps} icon={Sword} color="orange" />
          <CountItem count={currentCounts.healers} icon={FirstAid} color="green" />
        </> : null}
      </HStack>
    </VStack>
  )
}

export default PlayerCount