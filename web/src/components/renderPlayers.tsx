import React, { useState, useEffect } from "react";
import PlayerCard from "./playerCard";
import PlayerFormModal from "./playerFormModal";
import { PlayerObject } from "./providers/interfaces";

interface RenderPlayersInterface {
  players: Array<PlayerObject>;
  setPlayers(players: Array<PlayerObject>): void;
}

const RenderPlayers = ({ players, setPlayers }: RenderPlayersInterface) => {
  const [modalOpen, setModalOpen] = useState(false);

  const removePlayer = (id: number): void => {
    const newPlayers = players.filter(
      (player: PlayerObject) => player.id !== id
    );
    setPlayers(newPlayers);
  };

  const updatePlayer = (updatedPlayer: PlayerObject): PlayerObject => {
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
    return updatedPlayer;
  };

  const addPlayer = (newPlayer: PlayerObject): void => {
    const newPlayers: Array<PlayerObject> = [...players, newPlayer];
    setPlayers(newPlayers);
    setModalOpen(false);
    return;
  };

  const Players = () =>
    players ? (
      <>
        {players.map((player) => (
          <PlayerCard
            style={cardStyle}
            key={player.id.toString()}
            player={player}
            removePlayer={removePlayer}
            updatePlayer={updatePlayer}
          />
        ))}
      </>
    ) : null;

  const havePlayers = () => (players ? players.length : 0);

  return (
    <>
      <div style={cardContainer}>
        <Players />
        <br />
        <br />
        <PlayerFormModal
          visible={modalOpen}
          close={() => setModalOpen(false)}
          addPlayer={addPlayer}
          arrayLength={havePlayers()}
          removePlayer={removePlayer}
          updatePlayer={updatePlayer}
          player={null}
        />
        <button onClick={() => setModalOpen(!modalOpen)}>Add Player</button>
      </div>
    </>
  );
};
export default RenderPlayers;

const cardStyle: React.CSSProperties = {
  width: "30%",
  height: "100%",
};
const cardContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
};
