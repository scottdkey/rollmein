// eslint-disable-next-line
import React, { useState } from "react";
import Modal from "react-modal";
import { usePlayerData } from "./providers/PlayerProvider";

import {
  PlayerObject,
  PlayerFormModalInterface,
  PlayerFormObject,
} from "./utils/Interfaces";

const PlayerFormModal = ({
  visible,
  close,
  player,
}: PlayerFormModalInterface) => {
  const [name, setName] = useState<string>(player ? player.name : "");

  const [tank, setTank] = useState<boolean>(player ? player.tank : false);

  const [dps, setDps] = useState<boolean>(player ? player.dps : false);

  const [healer, setHealer] = useState<boolean>(player ? player.healer : false);

  const { updatePlayer, addPlayer, removePlayer } = usePlayerData()!;

  const clearForm = () => {
    setName("");
    setTank(false);
    setDps(false);
    setHealer(false);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const p: PlayerFormObject = {
      name,
      tank,
      dps,
      healer,
      locked: false,
      in: true,
    };
    if (player) {
      const updatedPlayer: PlayerObject = { ...p, id: player.id };
      updatePlayer(updatedPlayer);
    } else {
      const newPlayer: PlayerFormObject = { ...p };
      addPlayer(newPlayer);
    }
    clearForm();
    close();
  };

  return (
    <Modal isOpen={visible}>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Tank:</label>
        <input
          type="checkbox"
          checked={tank}
          name="Tank"
          onChange={() => {
            setTank(!tank);
          }}
        />
        <label>DPS:</label>
        <input
          type="checkbox"
          checked={dps}
          name="Dps"
          onChange={() => {
            setDps(!dps);
          }}
        />
        <label>Healer:</label>
        <input
          type="checkbox"
          checked={healer}
          name="healer"
          onChange={() => {
            setHealer(!healer);
          }}
        />
        {player ? (
          <button
            onClick={() => {
              removePlayer(player.id);
            }}
          >
            remove
          </button>
        ) : null}
        <button onClick={close}>Close</button>
        <input type="submit" />
      </form>
    </Modal>
  );
};

export default PlayerFormModal;
