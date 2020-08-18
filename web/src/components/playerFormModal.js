import React, { useState } from "react";
import Modal from "react-awesome-modal";
//todo: form validation.
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

  const [tank, setTank] = useState(player ? player.tank : false);

  const [dps, setDps] = useState(player ? player.dps : false);

  const [healer, setHealer] = useState(player ? player.healer : false);

  const clearForm = () => {
    setName("");
    setLocked(false);
    setTank(false);
    setDps(false);
    setHealer(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const p = {
      name,
      tank,
      dps,
      healer,
      locked,
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
          checked={healer}
          name="healer"
          onChange={() => {
            setHealer(!healer);
          }}
        />
        <button onClick={close}>Close</button>
        <input type="submit" />
      </form>
    </Modal>
  );
};

export default PlayerFormModal;
