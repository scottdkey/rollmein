import React from 'react'
import { PlayerObject } from "../types/Interfaces"

type OutOfGroupProps = {
  group: Array<PlayerObject>
}

const OutOfGroup = ({ group }: OutOfGroupProps) => {
  return (
    group === undefined ? null :
      <>
        <h3>Not in Current Roll:</h3>
        {group.map((player: PlayerObject) => (
          <div key={player.playerName + 10 + player.id}>{player.playerName}, </div>
        ))}
      </>

  )
}


export default OutOfGroup