import { Box, Circle, Flex, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { Lock, Dice, Sheild, Sword, FirstAid } from "../assets"
import { PlayersQuery, useOptionsQuery, usePlayersQuery } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"
import { PlayerCounts } from "../utils/rollHelpers"



const PlayerCount = ({ }) => {
  const { data } = usePlayersQuery<PlayersQuery, Error>(client);

  const optionsQuery = useOptionsQuery(client)
  const rollType = optionsQuery.data?.options?.rollType
  const players = data?.players
  const currentCounts = players && rollType ? PlayerCounts(players, rollType) : { locked: 0, inTheRoll: 0, tanks: 0, dps: 0, healers: 0 }



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
    <HStack align="center" justify="center" position="relative">
      <CountItem count={currentCounts.locked} icon={Lock} color="yellow" />
      <CountItem count={currentCounts.inTheRoll} icon={Dice} color="teal" />
      {optionsQuery.data?.options?.rollType === "role" ? <>
        <CountItem count={currentCounts.tanks} icon={Sheild} color="blue" />
        <CountItem count={currentCounts.dps} icon={Sword} color="orange" />
        <CountItem count={currentCounts.healers} icon={FirstAid} color="green" />
      </> : null}
    </HStack>
  )
}

export default PlayerCount