// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { images, svgs } from "./utils/Images";
import { PlayerObject } from "./utils/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";

interface PlayerCardInterface {
  player: PlayerObject;
}

const PlayerCard = ({ player }: PlayerCardInterface) => {
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
    <div className={player.locked ? "card-locked" : "card"}>
      <div className="card-locked-area" onClick={handleLocked}>
        {player.locked ? (
          <svgs.ClosedLock className="image locked" />
        ) : (
          <svgs.OpenLock className="image unlocked" />
        )}
      </div>
      <div className="card-head">
        <div className="name">{player.name}</div>

        <svgs.Trash
          className="image delete-icon"
          onClick={() => removePlayer(player.id)}
        />
      </div>
      <div className="role-selection">
        <div className="card-body">
          <img
            className={tank ? "image roles_active" : "image roles_inactive"}
            src={images.tank}
            alt="tank logo"
            onClick={() => {
              setTank(!tank);
              updateRoles("tank", !tank);
            }}
          />
          <img
            className={healer ? "image roles_active" : "image roles_inactive"}
            src={images.healer}
            alt="healer logo"
            onClick={() => {
              setHealer(!healer);
              updateRoles("healer", !healer);
            }}
          />
          <img
            className={dps ? "image roles_active" : "image roles_inactive"}
            src={images.dps}
            alt="dps logo"
            onClick={() => {
              setDps(!dps);
              updateRoles("dps", !dps);
            }}
          />
          <svgs.Dice
            className={`image ${player.in ? "inTheRoll" : "outOfTheRoll"}`}
            onClick={handleIn}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
