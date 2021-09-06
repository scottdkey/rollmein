import { Box, Circle, Flex, HStack, Icon, useColorModeValue } from "@chakra-ui/react"
import React, { FC, useEffect, useState } from "react"
import { Lock, Dice, Sheild, Sword, FirstAid } from "../assets"
import { PlayersQuery, useOptionsQuery, usePlayersQuery } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"
import { PlayerCounts } from "../utils/rollHelpers"



const PlayerCount = ({ }) => {
  const { data, isLoading } = usePlayersQuery<PlayersQuery, Error>(client);

  const optionsQuery = useOptionsQuery(client)
  const [counts, setCounts] = useState<PlayerCounts>()

  useEffect(() => {
    if (!isLoading && data?.players && optionsQuery.data?.options) {

      const rollType = optionsQuery.data?.options?.rollType
      const players = data?.players
      const currentCounts = PlayerCounts(players, rollType)
      setCounts(currentCounts)
    }
  }, [isLoading, data?.players, optionsQuery.data])


  type CountItemType = {
    count?: number
    icon: typeof Icon
    color: string
  }
  const CountItem: FC<CountItemType> = ({ count = 0, icon, color }: CountItemType): JSX.Element => {
    const themeColor = useColorModeValue(`${color}.500`, `${color}.600`)
    return (
      <Flex justify="center" align="center" position="relative">
        <Circle backgroundColor="gray" position="absolute" zIndex="1" fontSize="2xl" >{count}</Circle>
        <Icon as={icon} color={themeColor} opacity="70%" w="10" h="10" />
      </Flex>
    )
  }

  return (
    <HStack align="center" justify="center">
      <CountItem count={counts?.locked} icon={Lock} color="yellow" />
      <CountItem count={counts?.inTheRoll} icon={Dice} color="teal" />
      {optionsQuery.data?.options?.rollType === "role" ? <>
        <CountItem count={counts?.tanks} icon={Sheild} color="blue" />
        <CountItem count={counts?.dps} icon={Sword} color="orange" />
        <CountItem count={counts?.healers} icon={FirstAid} color="green" />
      </> : null}
    </HStack>
  )
}

export default PlayerCount