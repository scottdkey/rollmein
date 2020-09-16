// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { images } from "./utils/Images";
import { PlayerObject } from "./utils/Interfaces";
import "./styles/imageStyles.scss";
import { usePlayerData } from "./providers/PlayerProvider";

interface PlayerCardInterface {
  player: PlayerObject;
  style: object;
}

const PlayerCard = ({ player, style }: PlayerCardInterface) => {
  const [tank, setTank] = useState(player.tank);
  const [dps, setDps] = useState(player.dps);
  const [healer, setHealer] = useState(player.healer);

  const { updatePlayer, removePlayer } = usePlayerData()!;

  const handleLocked = () => {
    const p = { ...player, locked: !player.locked };
    updatePlayer(p);
  };

  const handleIn = () => {
    const p = { ...player, in: !player.in };
    updatePlayer(p);
  };

  const updateRoles = (role: string, newBoolean: boolean) => {
    const updatedPlayer: PlayerObject = { ...player, [role]: newBoolean };
    updatePlayer(updatedPlayer);
  };

  useEffect(() => {}, [player]);
  return (
    <div style={style}>
      <h2>{player.name}</h2>

      <img
        className={player.locked ? "image locked" : "image unlocked"}
        src={player.locked ? images.closedLock : images.openLock}
        alt="padlock logo"
        onClick={handleLocked}
      />
      <img
        className={player.in ? "image inTheRoll" : "image outOfTheRoll"}
        src={images.dice}
        alt="padlock logo"
        onClick={handleIn}
      />
      <img
        className="image deleteIcon"
        src={images.trash}
        alt="padlock logo"
        onClick={() => removePlayer(player.id)}
      />
      <div>
        <img
          className={tank ? "image roles_active" : "image roles_inactive"}
          src={player.tank ? images.tank : images.tankUnselected}
          alt="tank logo"
          onClick={() => {
            setTank(!tank);
            updateRoles("tank", !tank);
          }}
        />
        <img
          className={healer ? "image roles_active" : "image roles_inactive"}
          src={healer ? images.healer : images.healerUnselected}
          alt="healer logo"
          onClick={() => {
            setHealer(!healer);
            updateRoles("healer", !healer);
          }}
        />
        <img
          className={dps ? "image roles_active" : "image roles_inactive"}
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
