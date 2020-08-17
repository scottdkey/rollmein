import React, { useState } from "react";
import Modal from "react-awesome-modal";

const PlayerFormModal = ({
  visible,
  close,
  player,
  updatePlayer,
  addPlayer,
  arrayLength,
}) => {
  const [name, setName] = useState(player ? player.name : "");
  const [locked, setLocked] = useState(player ? player.locked : false);

  const [tank, setTank] = useState(player ? player.roles.tank : false);

  const [dps, setDps] = useState(player ? player.roles.dps : false);

  const [heal, setHeal] = useState(player ? player.roles.heal : false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (player) {
      const p = {
        name,
        roles: { tank: tank, dps: dps, heal: heal },
        locked,
        id: player.id,
      };
      updatePlayer(p);
    } else {
      const id = arrayLength + 1;
      const p = {
        name,
        roles: { tank: tank, dps: dps, heal: heal },
        locked,
        id,
      };
      addPlayer(p);
    }
  };

  return (
    <Modal visible={visible} effect="fadeInUp">
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Locked?</label>
        <input
          type="checkbox"
          checked={locked}
          onChange={() => setLocked(!locked)}
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
          checked={heal}
          name="heal"
          onChange={() => {
            setHeal(!heal);
          }}
        />
        <button onClick={close}>Close</button>
        <input type="submit" />
      </form>
    </Modal>
  );
};

export default PlayerFormModal;
