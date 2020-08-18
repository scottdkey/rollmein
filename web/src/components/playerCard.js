import React, { useState } from "react";
import PlayerFormModal from "./playerFormModal";

const PlayerCard = ({ player, removePlayer, updatePlayer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLocked = () => {
    const p = { ...player, locked: !player.locked };
    updatePlayer(p);
  };

  const handleIn = () => {
    const p = { ...player, in: !player.in };
    updatePlayer(p);
  };
  return (
    <>
      <div> Name: {player.name}</div>
      <label>Locked?</label>
      <input type="checkbox" checked={player.locked} onChange={handleLocked} />
      <label>In the Roll?</label>
      <input type="checkbox" checked={player.in} onChange={handleIn} />
      <div>{player.tank ? "Tank" : null}</div>
      <div>{player.healer ? "Healer" : null}</div>
      <div>{player.dps ? "DPS" : null}</div>
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
