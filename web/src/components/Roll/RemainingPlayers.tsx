import { useRollSlice } from "../../stores/Roll.slice"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const RemainingPlayers = () => {
  const remaining = useRollSlice(state => state.remainingPlayers)

  if (remaining.length > 0) {
    return (
      <div className="vStack">
        <h1>Remaining Players</h1>
        <div className="hStack">
          {
            remaining.map(id => <RollPlayerDisplay playerId={id} key={`${id}-remainingPlayers`} />)
          }
        </div>
      </div>
    )
  }

  return null
}

