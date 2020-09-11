import React from 'react'
import { PlayerObject } from "./utils/Interfaces"

type OutOfGroupProps = {
  group: Array<PlayerObject>
}

const OutOfGroup = ({ group }: OutOfGroupProps) => {
  return (
    group === undefined ? null :
      <>
        <h3>Not in Current Roll:</h3>
        {group.map((player: PlayerObject) => (
          <div key={player.name + 10 + player.id}>{player.name}, </div>
        ))}
      </>

  )
}


export default OutOfGroup