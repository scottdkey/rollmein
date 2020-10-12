// eslint-disable-next-line
import React, { useState, useEffect } from "react";

import IMAGE from "../assets/Images";
import SVG from "../assets/SVG";
import { PlayerObject, PlayerCardInterface } from "./utils/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";

const PlayerCard = ({ player }: PlayerCardInterface) => {
  const [cardPlayer, setCardPlayer] = useState<PlayerObject>(player);

  const { updatePlayer, removePlayer } = usePlayerData()!;

  const handleLocked = () => {
    const p = { ...cardPlayer, locked: !cardPlayer.locked };
    setCardPlayer(p);
    updatePlayer(p);
  };

  const handleIn = () => {
    const p = { ...cardPlayer, in: !cardPlayer.in };
    setCardPlayer(p);
    updatePlayer(p);
  };

  const updateRoles = (role: string, newBoolean: boolean) => {
    const updatedPlayer: PlayerObject = { ...cardPlayer, [role]: newBoolean };
    updatePlayer(updatedPlayer);
  };

  useEffect(() => {
    setCardPlayer(player);
  }, [player]);
  
  return (
    <div className={cardPlayer.locked ? "card-locked" : "card"}>
      <div className="card-locked-area" onClick={handleLocked}>
        {cardPlayer.locked ? (
          <SVG.ClosedLock className="image locked" />
        ) : (
          <SVG.OpenLock className="image unlocked" />
        )}
      </div>
      <div className="card-head">
        <div className="name">{cardPlayer.name}</div>

        <SVG.Trash
          className="image delete-icon"
          onClick={() => removePlayer(cardPlayer.id)}
        />
      </div>
      <div className="role-selection">
        <div className="card-body">
          <img
            className={
              cardPlayer.tank ? "image roles_active" : "image roles_inactive"
            }
            src={IMAGE.tank}
            alt="tank logo"
            onClick={() => {
              const tank = !cardPlayer.tank;
              setCardPlayer({ ...cardPlayer, tank });
              updateRoles("tank", tank);
            }}
          />
          <img
            className={
              cardPlayer.healer ? "image roles_active" : "image roles_inactive"
            }
            src={IMAGE.healer}
            alt="healer logo"
            onClick={() => {
              const healer = !cardPlayer.healer;
              setCardPlayer({ ...cardPlayer, healer });
              updateRoles("healer", healer);
            }}
          />
          <img
            className={
              cardPlayer.dps ? "image roles_active" : "image roles_inactive"
            }
            src={IMAGE.dps}
            alt="dps logo"
            onClick={() => {
              const dps = !cardPlayer.dps;
              setCardPlayer({ ...cardPlayer, dps });
              updateRoles("dps", dps);
            }}
          />
          <SVG.Dice
            className={`image ${
              cardPlayer.in ? "in-the-roll-active" : "in-the-roll"
            }`}
            onClick={handleIn}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
