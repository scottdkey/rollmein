import { HStack, Heading, VStack } from "@chakra-ui/react"
import { useRollSlice } from "../../stores/Roll.slice"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const RemainingPlayers = () => {
  const remaining = useRollSlice(state => state.remainingPlayers)

  if (remaining.length > 0) {
    return (
      <VStack>
        <Heading>Remaining Players</Heading>
        <HStack>
          {
            remaining.map(player => <RollPlayerDisplay player={player} />)
          }
        </HStack>
      </VStack>
    )
  }

  return null
}

