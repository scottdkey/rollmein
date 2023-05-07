import { Heading, VStack } from "@chakra-ui/react"
import { usePlayersSlice } from "../../stores/Players.slice"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"
import { RollType } from "../../utils/group.api"
import { useRollSlice } from "../../stores/Roll.slice"
import { FC } from "react"
import { FfaRollPlayers } from "./FfaRollPlayers"
import { RollPlayers } from "./RollPlayers"

export enum RollInfoState {
  CURRENT = 'current',
  PREVIOUS = 'previous',
  REMAINING = 'remaining'
}

export const CurrentRoll: FC<{hideHeading?: boolean}> = ({hideHeading}) => {
  const currentRoll = useRollSlice(state => state.currentRoll)
  const rollType = useCurrentGroupSlice(state => state.rollType)

  if(currentRoll.ffa || currentRoll.tank || currentRoll.healer || currentRoll.dps) {
    return (
      <VStack>
        <Heading hidden={hideHeading}>Current Roll</Heading>
        {rollType === RollType.FFA ? <FfaRollPlayers roll={currentRoll} /> : <RollPlayers roll={currentRoll} />}
      </VStack>
    )
  }
  return null
}





