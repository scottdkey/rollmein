// eslint-disable-next-line
import React, { useState } from "react";
import PlayerCard from "./PlayerCard";
import PlayerFormModal from "./PlayerFormModal";
import { usePlayerData } from "./providers/PlayerProvider";

const RenderPlayers = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const { players, showPlayers } = usePlayerData()!;

  const Players = () =>
    players ? (
      <>
        {players.map((player) => (
          <PlayerCard key={player.id.toString()} player={player} />
        ))}
      </>
    ) : null;

  return (
    <div>
      <div className={showPlayers ? "player-cards" : "player-cards-open"}>
        <Players />
        <button onClick={() => setModalOpen(!modalOpen)}>Add Player</button>
      </div>
      <PlayerFormModal
        visible={modalOpen}
        close={() => setModalOpen(false)}
        player={null}
      />
    </div>
  );
};
export default RenderPlayers;
