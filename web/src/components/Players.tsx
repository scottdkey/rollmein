// eslint-disable-next-line
import React from "react";

import PlayerCard from "./PlayerCard";
import PlayerCardForm from "./PlayerCardForm";
import { usePlayerData } from "./providers/PlayerProvider";

const RenderPlayers = () => {
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
    <div className={showPlayers ? "player-cards-open" : "player-cards"}>
      <Players />
      <PlayerCardForm />
    </div>
  );
};
export default RenderPlayers;
