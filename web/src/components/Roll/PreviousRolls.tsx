import { Button, HStack } from "@chakra-ui/react"
import { useRollSlice } from "../../stores/Roll.slice"
import { useState } from "react"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"
import { RollType } from "../../utils/group.api"
import { FfaRollPlayers } from "./FfaRollPlayers"
import { RollPlayers } from "./RollPlayers"


export const PreviousRolls = () => {
  const previousRolls = useRollSlice(state => state.previousRolls)
  const [position, setPosition] = useState(previousRolls.length - 1)
  const rollType = useCurrentGroupSlice(state => state.rollType)

  if (previousRolls.length > 0) {
    return (
      <HStack>
        <Button onClick={() => {
          setPosition(position - 1)
        }}>Previous</Button>
        {rollType === RollType.FFA ?
          <FfaRollPlayers roll={previousRolls[position]} /> :
          <RollPlayers roll={previousRolls[position]} />
        }
        <Button onClick={() => {
          setPosition(position + 1)
        }}>Next</Button>

      </HStack>
    )
  }
  return null
}