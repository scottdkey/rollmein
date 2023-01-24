import { Heading, HStack, Spinner, VStack, Text } from "@chakra-ui/react"
import { Lock, Dice, Shield, Sword, FirstAid } from "../assets"
import { useGroupPlayerCountQuery, useGroupQuery } from "../utils/groupApi"
import useGroupWs from "../providers/GroupWebsocketProvider"
import { CountItem } from "./CountItem"



const PlayerCount = () => {

  const { groupId } = useGroupWs()
  const { isLoading: groupLoading, data: group } = useGroupQuery(groupId, true)
  const { data: currentCounts, isLoading: countLoading, error } = useGroupPlayerCountQuery(groupId, true)


  if (countLoading || groupLoading) {
    return (<VStack>
      <Heading size="sm">Players</Heading>
      <Spinner></Spinner>
    </VStack>)
  }

  if (currentCounts) {
    return (
      <VStack>
        <Heading size="sm">Players</Heading>
        <HStack align="center" justify="center" position="relative">
          <CountItem count={currentCounts.locked} icon={Lock} color="yellow" />
          <CountItem count={currentCounts.inTheRoll} icon={Dice} color="teal" />
          {group?.rollType === "role" ? <>
            <CountItem count={currentCounts.tanks} icon={Shield} color="blue" />
            <CountItem count={currentCounts.dps} icon={Sword} color="orange" />
            <CountItem count={currentCounts.healers} icon={FirstAid} color="green" />
          </> : null}
        </HStack>
      </VStack>
    )
  }
  return (<VStack>
    <Heading size="sm">Players</Heading>
    <Text>error</Text>
  </VStack>)


}



export default PlayerCount