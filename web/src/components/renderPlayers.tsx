import React, { useState } from "react";
import PlayerCard from "./playerCard";
import PlayerFormModal from "./playerFormModal";
import { PlayerObject } from "./providers/interfaces";
import { PlayerUpdate, NewPlayer, DeletePlayer } from "./providers/renderPlayersCalls";

interface RenderPlayersInterface {
  players: Array<PlayerObject>;
  setPlayers(players: Array<PlayerObject>): void;
}

const RenderPlayers = ({ players, setPlayers }: RenderPlayersInterface) => {
  const [modalOpen, setModalOpen] = useState(false);

  const removePlayer = (id: number) => {
    setPlayers(DeletePlayer(id, players));
  };

  const updatePlayer = (player: PlayerObject) => {
    setPlayers(PlayerUpdate(player, players));
    setModalOpen(false);
  }


  const addPlayer = (newPlayer: PlayerObject) => {
    setPlayers(NewPlayer(newPlayer, players));
    setModalOpen(false);
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
