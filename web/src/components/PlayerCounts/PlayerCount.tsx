import { Heading, HStack, Spinner, VStack, Text } from "@chakra-ui/react"
import { Lock, Dice, Shield, Sword, FirstAid } from "../../assets"
import { CountItem } from "../CountItem"
import { useGetPlayerCount } from "../../utils/playerCounts.api"
import { FC } from "react"
import { usePlayerCountsSlice } from "../../stores/PlayerCounts.slice"
import { RollType } from "../../../../shared/types/Group.enum"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"



const PlayerCount = () => {
  const playerCounts = usePlayerCountsSlice(state => state.playerCounts)
  const rollType = useCurrentGroupSlice(state => state.rollType)
  const groupId = useCurrentGroupSlice(state => state.id)
  const { isLoading } = useGetPlayerCount({ groupId })


  if (isLoading) {
    return (<VStack>
      <Heading size="sm">Players</Heading>
      <Spinner></Spinner>
    </VStack>)
  }

  if (playerCounts) {
    return (
      <VStack>
        <Heading size="sm">Players</Heading>
        <HStack align="center" justify="center" position="relative">
          <CountItem count={playerCounts.locked} icon={Lock} color="yellow" />
          <CountItem count={playerCounts.inTheRoll} icon={Dice} color="teal" />
          {rollType === RollType.ROLE ? <>
            <CountItem count={playerCounts.tanks} icon={Shield} color="blue" />
            <CountItem count={playerCounts.dps} icon={Sword} color="orange" />
            <CountItem count={playerCounts.healers} icon={FirstAid} color="green" />
          </> : null}
        </HStack>
      </VStack>
    )
  }
  return (
    <VStack>
      <Heading size="sm">Players</Heading>
      <Text>error</Text>
    </VStack>
  )


}



export default PlayerCount