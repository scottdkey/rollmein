// eslint-disable-next-line
import React from "react";
import Login from "./Login";
import PlayerCard from "./PlayerCard";
import PlayerFormModal from "./PlayerFormModal";
import { useAuth } from "./providers/AuthProvider";
import { usePlayerData } from "./providers/PlayerProvider";

const RenderPlayers = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const { players } = usePlayerData()!;
  const { authenticated } = useAuth()!;

  const Players = () =>
    players ? (
      <>
        {players.map((player) => (
          <PlayerCard
            style={cardStyle}
            key={player.id.toString()}
            player={player}
          />
        ))}
      </>
    ) : null;

  return (
    <>
      <div style={cardContainer}>
        {authenticated ? <Players /> : <Login />}
        <br />
        <br />
        <PlayerFormModal
          visible={modalOpen}
          close={() => setModalOpen(false)}
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
  height: "30%",
};
const cardContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
};
