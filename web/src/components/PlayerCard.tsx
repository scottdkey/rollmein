// eslint-disable-next-line
import React, { useState, useEffect } from "react";

// import IMAGE from "../assets/Images";
// import SVG from "../assets/SVG";

import { ReactComponent as ClosedLock } from "../assets/svgs/Lock.svg";
import { ReactComponent as OpenLock } from "../assets/svgs/OpenLock.svg";
import { ReactComponent as Dice } from "../assets/svgs/Dice.svg";
import { ReactComponent as Trash } from "../assets/svgs/Trash.svg";
import Tank from "../assets/images/TANK.png";
import Dps from "../assets/images/DPS.png";
import Healer from "../assets/images/HEALER.png";
import {
  PlayerObject,
  PlayerCardInterface,
  RoleLogoImage,
} from "../types/Interfaces";
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
          <ClosedLock className="image locked" />
        ) : (
          <OpenLock className="image unlocked" />
        )}
      </div>
      <div className="card-head">
        <div className="name">{cardPlayer.name}</div>
        <Trash
          className="image delete-icon"
          onClick={() => removePlayer(cardPlayer.id)}
        />
      </div>
      <div className="card-body">
        <RoleLogoImage
          active={cardPlayer.tank}
          source={Tank}
          type="tank"
        />
        <RoleLogoImage
          active={cardPlayer.healer}
          source={Healer}
          type="healer"
        />
        <RoleLogoImage active={cardPlayer.dps} source={Dps} type="dps" />

        <Dice
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
