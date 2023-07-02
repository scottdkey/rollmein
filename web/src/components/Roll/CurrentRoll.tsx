import { Heading, VStack } from "@chakra-ui/react"
import { usePlayersSlice } from "../../stores/Players.slice"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"
import { useRollSlice } from "../../stores/Roll.slice"
import { FC } from "react"
import { FfaRollPlayers } from "./FfaRollPlayers"
import { RollPlayers } from "./RollPlayers"
import { RollType } from "../../types/RollType.enum"

export const CurrentRoll: FC<{ hideHeading?: boolean }> = ({ hideHeading }) => {
  const currentRoll = useRollSlice(state => state.currentRoll)
  const rollType = useCurrentGroupSlice(state => state.rollType)

  if (currentRoll) {
    return (
      <VStack>
        <Heading hidden={hideHeading}>Current Roll</Heading>
        {rollType === RollType.FFA ? <FfaRollPlayers roll={currentRoll} /> : <RollPlayers roll={currentRoll} />}
      </VStack>
    )
  }
  return null
}





