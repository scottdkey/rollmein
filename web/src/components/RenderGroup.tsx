// eslint-disable-next-line
import React from "react";
import { PlayerObject } from "../types/Interfaces";
import { RenderDPSType } from "../types/Types";

const RenderRemaining = ({ players, header }: RenderDPSType) => {
  if (players === undefined) {
    return null;
  } else {
    return (
      <>
        <h3>{header}</h3>
        {players.map((player: PlayerObject) => (
          <div key={player.name + 10 + player.id}>{player.name}, </div>
        ))}
      </>
    );
  }
};

export default RenderRemaining;
