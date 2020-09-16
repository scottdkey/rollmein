// eslint-disable-next-line
import React from "react";
import RenderPlayers from "./components/RenderPlayers";
import { PlayerProvider } from "./components/providers/PlayerProvider";
import GroupRoll from "./components/GroupRoll";

function App() {
  return (
    <div className="App">
      <PlayerProvider>
        <h1>Roll Me in</h1>
        <RenderPlayers />
        <GroupRoll />
      </PlayerProvider>
    </div>
  );
}

export default App;
