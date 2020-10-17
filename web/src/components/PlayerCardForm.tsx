// eslint-disable-next-line
import React, { useState } from "react";
import { Form, Input } from "antd";

import { ReactComponent as ClosedLock } from "./assets/svgs/Lock.svg";
import { ReactComponent as OpenLock } from "./assets/svgs/OpenLock.svg";
import { ReactComponent as Dice } from "./assets/svgs/Dice.svg";
import Tank from "./assets/images/TANK.png";
import Dps from "./assets/images/DPS.png";
import Healer from "./assets/images/HEALER.png";

import { BlankPlayerObject, RoleLogoImage } from "../types/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";

const PlayerCardForm = () => {
  const { addPlayer, blankPlayer } = usePlayerData()!;

  const [BlankPlayer, setBlankPlayer] = useState<BlankPlayerObject>(
    blankPlayer
  );
  const [newPlayerFormOpen, setNewPlayerFormOpen] = useState(false);

  const updateBoolean = (type: string, newBoolean: boolean) => {
    const updatedPlayer = { ...BlankPlayer, [type]: newBoolean };
    setBlankPlayer(updatedPlayer);
  };

  const handleSubmit = () => {
    toggleForm();
    addPlayer(BlankPlayer);
  };

  function toggleForm() {
    setNewPlayerFormOpen(!newPlayerFormOpen);
  }

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
  if (newPlayerFormOpen) {
    return (
      <div className={"card"}>
        New Player
        <button onClick={() => toggleForm()}>Cancel</button>
        <button onClick={handleSubmit}>Save</button>
        <div
          className="card-locked-area"
          onClick={() => updateBoolean("locked", !BlankPlayer.locked)}
        >
          {BlankPlayer.locked ? (
            <ClosedLock className="image locked" />
          ) : (
            <OpenLock className="image unlocked" />
          )}
        </div>
        <div className="card-head">
          <Form>
            <Form.Item
              label="name"
              name="name"
              rules={[
                { required: true, message: "Please input this player's name." },
              ]}
            >
              <Input
                value={BlankPlayer.name}
                onChange={(e) =>
                  setBlankPlayer({ ...BlankPlayer, name: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        </div>
        <div className="card-body">
          <RoleLogoImage active={BlankPlayer.tank} source={Tank} type="tank" />
          <RoleLogoImage
            active={BlankPlayer.healer}
            source={Healer}
            type="healer"
          />
          <RoleLogoImage active={BlankPlayer.dps} source={Dps} type="dps" />

          <Dice
            className={`image ${
              BlankPlayer.in ? "in-the-roll-active" : "in-the-roll"
            }`}
            onClick={() => updateBoolean("in", !BlankPlayer.in)}
          />
        </div>
      </div>
    );
  } else {
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
};

export default PlayerCardForm;
