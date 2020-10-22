// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";

import { ReactComponent as ClosedLock } from "./assets/svgs/Lock.svg";
import { ReactComponent as OpenLock } from "./assets/svgs/OpenLock.svg";
import { ReactComponent as Dice } from "./assets/svgs/Dice.svg";
import { ReactComponent as Trash } from "./assets/svgs/Trash.svg";
import Tank from "./assets/images/TANK.png";
import Dps from "./assets/images/DPS.png";
import Healer from "./assets/images/HEALER.png";
import {
  PlayerObject,
  PlayerCardInterface,
  PlayerFormObject,
} from "../types/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";
import RoleLogoImage from "./RoleLogoImage";

const PlayerCard = ({ player }: PlayerCardInterface) => {
  const {
    updatePlayer,
    removePlayer,
    addPlayer,
    blankPlayer,
  } = usePlayerData()!;

  const [cardPlayer, setCardPlayer] = useState<PlayerObject>(player!);
  const [newCardPlayer, setNewCardPlayer] = useState<PlayerFormObject>(
    blankPlayer
  );
  const [newPlayerFormOpen, setNewPlayerFormOpen] = useState(false);

  const updateCardPlayer = (type: string, newBoolean: boolean) => {
    const updatedPlayer = { ...cardPlayer, [type]: newBoolean };
    setCardPlayer(updatedPlayer);
    updatePlayer(updatedPlayer);
  };
  const updateNewPlayer = (type: string, newBoolean: boolean) => {
    const updatedPlayer = { ...cardPlayer, [type]: newBoolean };
    setNewCardPlayer(updatedPlayer);
  };
  function clearForm() {
    setNewCardPlayer(blankPlayer);
  }

  const handleSubmit = () => {
    toggleForm();
    const res = addPlayer(newCardPlayer);
    setCardPlayer(res);

    clearForm();
  };

  function toggleForm() {
    setNewPlayerFormOpen(!newPlayerFormOpen);
  }
  useEffect(() => {
    setCardPlayer(player!);
  }, [player]);

  function AddPlayerArea() {
    return (
      <div
        className="add-player"
        onClick={toggleForm}
        style={{ height: "150px" }}
      >
        <div className="add-player-button">Add Player</div>
      </div>
    );
  }
  function CurrentPlayerCard() {
    return (
      <div className={"card"}>
        <div
          className="card-locked-area"
          onClick={() => updateCardPlayer("locked", !cardPlayer.locked)}
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
            updateBoolean={updateCardPlayer}
          />
          <RoleLogoImage
            active={cardPlayer.healer}
            source={Healer}
            type="healer"
            updateBoolean={updateCardPlayer}
          />
          <RoleLogoImage
            active={cardPlayer.dps}
            source={Dps}
            type="dps"
            updateBoolean={updateCardPlayer}
          />

          <Dice
            className={`image ${
              cardPlayer.in ? "in-the-roll-active" : "in-the-roll"
            }`}
            onClick={() => updateCardPlayer("in", !cardPlayer.in)}
          />
        </div>
      </div>
    );
  }

  if (player === undefined && !newPlayerFormOpen) {
    return <AddPlayerArea />;
  } else if (player) {
    return <CurrentPlayerCard />;
  } else {
    return (
      <div className={"card"}>
        <div
          className="card-locked-area"
          onClick={() => updateNewPlayer("locked", !newCardPlayer.locked)}
        >
          {newCardPlayer.locked ? (
            <ClosedLock className="image locked" />
          ) : (
            <OpenLock className="image unlocked" />
          )}
        </div>
        <div className="card-head">
          New Player
          <button onClick={() => toggleForm()}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
          <Form>
            <Form.Item
              label="name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input this player's name.",
                },
              ]}
            >
              <Input
                value={newCardPlayer.name}
                onChange={(e) =>
                  setNewCardPlayer({ ...newCardPlayer, name: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        </div>

        <div className="card-body">
          <RoleLogoImage
            active={newCardPlayer.tank}
            source={Tank}
            type="tank"
            updateBoolean={updateNewPlayer}
          />
          <RoleLogoImage
            active={newCardPlayer.healer}
            source={Healer}
            type="healer"
            updateBoolean={updateNewPlayer}
          />
          <RoleLogoImage
            active={newCardPlayer.dps}
            source={Dps}
            type="dps"
            updateBoolean={updateNewPlayer}
          />

          <Dice
            className={`image ${
              newCardPlayer.in ? "in-the-roll-active" : "in-the-roll"
            }`}
            onClick={() => updateNewPlayer("in", !newCardPlayer.in)}
          />
        </div>
      </div>
    );
  }
};

export default PlayerCard;
