import React, { useState, useEffect, Props } from "react";
import PlayerFormModal from "./playerFormModal";
import { images } from "./providers/images";
import { roleLogo } from "./providers/imageStyles";
import { PlayerObject } from "./providers/interfaces";

interface PlayerCardInterface {
  player: PlayerObject;
  style: object;
  removePlayer(id: number): void;
  updatePlayer(player: PlayerObject): PlayerObject;
}

const PlayerCard = ({
  player,
  removePlayer,
  updatePlayer,
  style,
}: PlayerCardInterface) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {}, [player]);
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

const styles = {
  card: { width: "100%" },
};
