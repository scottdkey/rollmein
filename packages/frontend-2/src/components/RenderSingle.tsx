import React from "react";
import { RenderSingleProps } from "../types/Types";

const RenderSingle = ({ player, header }: RenderSingleProps) => {
  if (player === undefined) {
    return null;
  } else {
    return (
      <>
        <h3>{header}: </h3>
        {player.playerName}
      </>
    );
  }
};

export default RenderSingle;
