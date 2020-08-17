import React, { useState } from "react";
import PlayerFormModal from "./playerFormModal";

const PlayerCard = ({ player, removePlayer, updatePlayer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = () => {
    const p = { ...player, locked: !player.locked };
    updatePlayer(p);
  };
  return (
    <>
        <div> Name: {player.name}</div>
        <label>Locked?</label>
        <input
          type="checkbox"
          checked={player.locked}
          onChange={handleChange}
        />
        <div>{player.roles.tank ? "Tank" : null}</div>
        <div>{player.roles.heal ? "Healer" : null}</div>
        <div>{player.roles.dps ? "DPS" : null}</div>
        <button onClick={() => setModalOpen(true)}> Edit</button>
        <button
          onClick={() => {
            removePlayer(player.id);
          }}
        >
          remove
        </button>
      <PlayerFormModal
        player={player}
        visible={modalOpen}
        close={() => setModalOpen(false)}
        updatePlayer={updatePlayer}
      />
    </>
  );
};

export default PlayerCard;
