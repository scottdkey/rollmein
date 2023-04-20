import { Heading, HStack, Spinner, VStack, Text } from "@chakra-ui/react"
import { Lock, Dice, Shield, Sword, FirstAid } from "../../assets"
import { CountItem } from "../CountItem"
import { useGroupSlice } from "../Group/Group.slice"
import { usePlayerCountsSlice } from "../PlayerCounts/PlayerCounts.slice"
import { useGetPlayerCount } from "../../utils/playerCounts.api"
import { useSession } from "next-auth/react"
import  { FC } from "react"



const PlayerCount: FC<{groupId: string}> = ({groupId}) => {

  const group = useGroupSlice(state => state.groups.find(group => group.id === groupId))
  const {data: session} = useSession()
  const { isLoading, data: playerCounts} = useGetPlayerCount({
    onSuccess: (_) => {},
    onError: (e) => {
      console.log({
        error: e,
        group
      })
    },
    groupId: group?.id,
    sessionToken: session?.id
  })


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
          {group?.rollType === "role" ? <>
            <CountItem count={playerCounts.tanks} icon={Shield} color="blue" />
            <CountItem count={playerCounts.dps} icon={Sword} color="orange" />
            <CountItem count={playerCounts.healers} icon={FirstAid} color="green" />
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