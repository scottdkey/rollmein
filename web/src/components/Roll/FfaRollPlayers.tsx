import { FC } from "react"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const FfaRollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.ffa) {
    return (
      <div className="hStack">{roll.ffa.map(id =>
        <RollPlayerDisplay key={id} playerId={id} />
      )}
      </div>
    )
  }
  return null
}