import React, { useState } from "react";
import PlayerCard from "./playerCard";
import PlayerFormModal from "./playerFormModal";

const RenderPlayers = ({ players, setPlayers }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const removePlayer = (id) => {
    const newPlayers = players.filter((player) => player.id !== id);
    setPlayers(newPlayers);
  };

  const updatePlayer = (updatedPlayer) => {
    const updatedPlayers = players.map((p) => {
      if (p.id === updatedPlayer.id) {
        const player = updatedPlayer;
        return player;
      } else {
        return p;
      }
    });
    setPlayers(updatedPlayers);
    setModalOpen(false);
  };

  const addPlayer = (newPlayer) => {
    const newPlayers = [...players, newPlayer];
    setPlayers(newPlayers);
    setModalOpen(false);
  };

  const Players = () =>
    players.map((player) => (
      <PlayerCard
        key={player.id}
        player={player}
        removePlayer={removePlayer}
        updatePlayer={updatePlayer}
      />
    ));
  return (
    <>
      <Players />
      <br />
      <br />
      <PlayerFormModal
        player={null}
        visible={modalOpen}
        close={() => setModalOpen(false)}
        addPlayer={addPlayer}
        arrayLength={players.length}
      />
      <button onClick={() => setModalOpen(!modalOpen)}>Add Player</button>
    </>
  );
};
export default RenderPlayers;
