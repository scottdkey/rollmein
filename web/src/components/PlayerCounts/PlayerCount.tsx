import { Lock, Dice, Shield, Sword, FirstAid } from "../../assets"
import { CountItem } from "../CountItem"
import { useGetPlayerCount } from "../../utils/playerCounts.api"
import { usePlayerCountsSlice } from "../../stores/PlayerCounts.slice"
import { useCurrentGroupSlice } from "../../stores/CurrentGroup.slice"
import { RollType } from "../../types/RollType.enum"



const PlayerCount = () => {
  const playerCounts = usePlayerCountsSlice(state => state.playerCounts)
  const rollType = useCurrentGroupSlice(state => state.rollType)
  const groupId = useCurrentGroupSlice(state => state.id)
  const { isLoading, } = useGetPlayerCount({ groupId })


  if (isLoading) {
    return (
      <div className="vStack">
        <h3>Players</h3>
        <div className="spinner" />
      </div>)
  }

  if (playerCounts) {
    return (
      <div className="vStack">
        <h3>Players</h3>
        <div className="hStack">
          <CountItem count={playerCounts.locked} icon={Lock} color="yellow" />
          <CountItem count={playerCounts.inTheRoll} icon={Dice} color="teal" />
          {rollType === RollType.ROLE ? <>
            <CountItem count={playerCounts.tanks} icon={Shield} color="blue" />
            <CountItem count={playerCounts.dps} icon={Sword} color="orange" />
            <CountItem count={playerCounts.healers} icon={FirstAid} color="green" />
          </> : null}
        </div>
      </div>
    )
  }
  return (
    <div className="vStack">
      <h4>Players</h4>
      <text>error</text>
    </div>
  )


}



export default PlayerCount