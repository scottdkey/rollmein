import { FC } from "react"
import { usePlayersSlice } from "../../stores/Players.slice"

export const RollPlayerDisplay: FC<{ playerId: string }> = ({ playerId }) => {
  const player = usePlayersSlice(state => state.players.find(p => p.id === playerId))
  if (!player) return null

  return (
    <div className="center">
      {player.name}
    </div>
  )
}

