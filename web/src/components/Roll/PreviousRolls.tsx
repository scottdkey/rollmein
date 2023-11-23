import { useRollSlice } from "../../stores/Roll.slice"
import { useState } from "react"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"
import { FfaRollPlayers } from "./FfaRollPlayers"
import { RollPlayers } from "./RollPlayers"
import { RollType } from "../../types/RollType.enum"


export const PreviousRolls = () => {
  const previousRolls = useRollSlice(state => state.previousRolls)
  const [position, setPosition] = useState(previousRolls.length - 1)
  const rollType = useCurrentGroupSlice(state => state.rollType)

  if (previousRolls.length > 0) {
    return (
      <div className="hStack">
        <button onClick={() => {
          setPosition(position - 1)
        }}>Previous</button>
        {rollType === RollType.FFA ?
          <FfaRollPlayers roll={previousRolls[position]} /> :
          <RollPlayers roll={previousRolls[position]} />
        }
        <button onClick={() => {
          setPosition(position + 1)
        }}>Next</button>

      </div>
    )
  }
  return null
}