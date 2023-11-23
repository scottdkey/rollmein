import { useState } from "react"
import PlayerCard from "./PlayerCard"
import { RollType } from "../../types/RollType.enum"

export const NewPlayerCard = (props: { rollType: RollType, groupId: string }) => {

  const [addPlayer, setAddPlayer] = useState(false)
  return (
    <>
      {addPlayer ?
        <PlayerCard rollType={props.rollType} profilePage={false} closeCreate={() => setAddPlayer(false)} groupId={props.groupId} /> :

        <div className="center">
          <button onClick={() => { setAddPlayer(true) }}>Add a player</button>
        </div>
      }
    </>
  )
}