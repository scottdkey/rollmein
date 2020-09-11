import React, { useState, useEffect } from "react";
import { images } from "./utils/Images";
import { roleLogo } from "./styles/ImageStyles";
import { PlayerObject } from "./utils/Interfaces";

interface PlayerCardInterface {
  player: PlayerObject;
  style: object;
  removePlayer(id: number): void;
  updatePlayer(player: PlayerObject): void;
}

const PlayerCard = ({
  player,
  removePlayer,
  updatePlayer,
  style,
}: PlayerCardInterface) => {
  const [tank, setTank] = useState(player.tank);
  const [dps, setDps] = useState(player.dps);
  const [healer, setHealer] = useState(player.healer);

  const handleLocked = () => {
    const p = { ...player, locked: !player.locked };
    updatePlayer(p);
  };

  const handleIn = () => {
    const p = { ...player, in: !player.in };
    updatePlayer(p);
  };

  const updateRoles = (
    role: string,
    newBoolean: boolean,
  ) => {
    const updatedPlayer: PlayerObject = { ...player, [role]: newBoolean };
    updatePlayer(updatedPlayer);
  };

  useEffect(() => { }, [player]);
  return (
    <div style={style}>
      <div> Name: {player.name}</div>
      <label>Locked?</label>
      <input type="checkbox" checked={player.locked} onChange={handleLocked} />
      <label>In the Roll?</label>
      <input type="checkbox" checked={player.in} onChange={handleIn} />
      <div>
        <img
          style={roleLogo}
          src={player.tank ? images.tank : images.tankUnselected}
          alt="tank logo"
          onClick={() => {
            setTank(!tank);
            updateRoles("tank", !tank);
          }}
        />
        <img
          style={roleLogo}
          src={healer ? images.healer : images.healerUnselected}
          alt="healer logo"
          onClick={() => {
            setHealer(!healer);
            updateRoles("healer", !healer);
          }}
        />
        <img
          style={roleLogo}
          src={dps ? images.dps : images.dpsUnselected}
          alt="dps logo"
          onClick={() => {
            setDps(!dps);
            updateRoles("dps", !dps);
          }}
        />
      </div>
    </div>
  );
};

export default PlayerCard;
