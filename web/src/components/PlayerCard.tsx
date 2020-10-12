// eslint-disable-next-line
import React, { useState, useEffect } from "react";

import IMAGE from "./utils/Images";
import SVG from "./utils/SVG";
import { PlayerObject, PlayerCardInterface } from "./utils/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";



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
          <SVG.ClosedLock className="image locked" />
        ) : (
          <SVG.OpenLock className="image unlocked" />
        )}
      </div>
      <div className="card-head">
        <div className="name">{player.name}</div>

        <SVG.Trash
          className="image delete-icon"
          onClick={() => removePlayer(player.id)}
        />
      </div>
      <div className="role-selection">
        <div className="card-body">
          <img
            className={tank ? "image roles_active" : "image roles_inactive"}
            src={IMAGE.tank}
            alt="tank logo"
            onClick={() => {
              setTank(!tank);
              updateRoles("tank", !tank);
            }}
          />
          <img
            className={healer ? "image roles_active" : "image roles_inactive"}
            src={IMAGE.healer}
            alt="healer logo"
            onClick={() => {
              setHealer(!healer);
              updateRoles("healer", !healer);
            }}
          />
          <img
            className={dps ? "image roles_active" : "image roles_inactive"}
            src={IMAGE.dps}
            alt="dps logo"
            onClick={() => {
              setDps(!dps);
              updateRoles("dps", !dps);
            }}
          />
          <SVG.Dice
            className={`image ${
              player.in ? "in-the-roll-active" : "in-the-roll"
            }`}
            onClick={handleIn}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
