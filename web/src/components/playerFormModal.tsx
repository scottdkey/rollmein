import React, { useState } from "react";
import Modal from "react-modal";

import { PlayerObject } from "./providers/interfaces";
//todo: form validation.

interface PlayerFormModalInterface {
  visible: boolean;
  player: PlayerObject | null;
  arrayLength: number;
  close(): void;
  updatePlayer(player: PlayerObject): void;
  addPlayer(player: PlayerObject): void;
  removePlayer(id: number): void;
}
// type PersonForm = {
//   name: string;
//   tank: boolean;
//   dps: boolean;
//   healer: boolean;
// };

const PlayerFormModal = ({
  visible,
  close,
  player,
  updatePlayer,
  addPlayer,
  arrayLength,
  removePlayer,
}: PlayerFormModalInterface) => {
  const [name, setName] = useState(player ? player.name : "");

  const [tank, setTank] = useState(player ? player.tank : false);

  const [dps, setDps] = useState(player ? player.dps : false);

  const [healer, setHealer] = useState(player ? player.healer : false);

  const clearForm = () => {
    setName("");
    setTank(false);
    setDps(false);
    setHealer(false);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const p = {
      name,
      tank,
      dps,
      healer,
      locked: false,
      in: true,
    };
    if (player) {
      const updatedPlayer = { ...p, id: player.id };
      updatePlayer(updatedPlayer);
    } else {
      const id = arrayLength + 1;
      const newPlayer = { ...p, id };
      addPlayer(newPlayer);
    }
    clearForm();
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
