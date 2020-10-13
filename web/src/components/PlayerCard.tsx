// eslint-disable-next-line
import React, { useState, useEffect } from "react";

import IMAGE from "../assets/Images";
import SVG from "../assets/SVG";
import {
  PlayerObject,
  PlayerCardInterface,
  RoleLogoImage,
} from "./utils/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";

const PlayerCard = ({ player }: PlayerCardInterface) => {
  const { updatePlayer, removePlayer } = usePlayerData()!;
 const [cardPlayer, setCardPlayer] = useState<PlayerObject>(player!);

  const updateBoolean = (type: string, newBoolean: boolean) => {
    const updatedPlayer = { ...cardPlayer, [type]: newBoolean };
    setCardPlayer(updatedPlayer);
    updatePlayer(updatedPlayer);
  };

  const RoleLogoImage = ({ active, source, type }: RoleLogoImage) => (
    <>
      <img
        className={`image ${active ? "roles_active" : "roles_inactive"}`}
        src={source}
        alt={`${type} logo`}
        onClick={() => {
          updateBoolean(type, !active);
        }}
      />
    </>
  );

  useEffect(() => {
    setCardPlayer(player!);
  }, [player]);

  return (
    <div className={cardPlayer.locked ? "card-locked" : "card"}>
      <div
        className="card-locked-area"
        onClick={() => updateBoolean("locked", !cardPlayer.locked)}
      >
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
      <div className="card-body">
        <RoleLogoImage
          active={cardPlayer.tank}
          source={IMAGE.tank}
          type="tank"
        />
        <RoleLogoImage
          active={cardPlayer.healer}
          source={IMAGE.healer}
          type="healer"
        />
        <RoleLogoImage active={cardPlayer.dps} source={IMAGE.dps} type="dps" />

        <SVG.Dice
          className={`image ${
            cardPlayer.in ? "in-the-roll-active" : "in-the-roll"
          }`}
          onClick={() => updateBoolean("in", !cardPlayer.in)}
        />
      </div>
    </div>
  );
};

export default PlayerCard;
