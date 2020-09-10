import React from 'react';
import { PlayerObject } from "./providers/interfaces"

type RenderDPSType = {
  players: Array<PlayerObject>
  headerName: string
}

const RenderRemaining = ({ players, headerName }: RenderDPSType) => {
  if (players === undefined) {
    return null
  } else {
    return (
      <>
        <h3>{headerName}</h3>
        {players.map((player: PlayerObject) => (
          <div key={player.name + 10 + player.id}>{player.name}, </div>
        ))}
      </>
    )
  }
}



export default RenderRemaining