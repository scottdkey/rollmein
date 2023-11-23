import { FC } from "react"
import { RollPlayerDisplay } from "./RollPlayerDisplay"

export const RollPlayers: FC<{ roll: IRoll }> = ({ roll }) => {
  if (roll.tank && roll.healer && roll.dps) {
    return (
      <div className="hStack">
        <div className="vStack">
          <h2>Tank</h2>
          <RollPlayerDisplay playerId={roll.tank} />
        </div>
        <div className="vStack">
          <h2>Healer</h2>
          <RollPlayerDisplay playerId={roll.healer} />
        </div>
        <div className="vStack">
          <h2>Dps</h2>
          {
            roll.dps.map(id => {
              return <RollPlayerDisplay key={id} playerId={id} />
            })
          }
        </div>
      </div>
    )
  }
  return null
}