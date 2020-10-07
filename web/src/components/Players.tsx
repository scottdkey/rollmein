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
      <div className={showPlayers ? "player-cards-open" : "player-cards"}>
        <Players />
        <div
          className="add-player"
          onClick={() => setModalOpen(!modalOpen)}
          style={{ height: "150px" }}
        >
          <div className="add-player-button">Add Player</div>
        </div>
      </div>
      {/* <PlayerFormModal
        visible={modalOpen}
        close={() => setModalOpen(false)}
        player={null}
      /> */}
    </div>
  );
};
export default RenderPlayers;
