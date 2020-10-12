import React from "react";
import { RenderSingleProps } from "./utils/Types";

const RenderSingle = ({ player, header }: RenderSingleProps) => {
  if (player === undefined) {
    return null;
  } else {
    return (
      <>
        <h3>{header}: </h3>
        {player.name}
      </>
    );
  }
};

export default RenderSingle;
