import React, { useState, useContext } from "react";
import RenderPlayers from "./components/renderPlayers";
import PlayerContext from "./components/providers/PlayerContext";
import { playersPlaceHolder } from "./components/providers/databasePlaceholder";
import ValidGroup from "./components/ValidGroup";

function App() {
  const playerContext = useContext(PlayerContext);
  const [players, setPlayers] = useState(playerContext);
  const [valid, setValid] = useState(false);
  return (
    <div className="App">
      <PlayerContext.Provider value={playersPlaceHolder}>
        <h1>Roll Me in</h1>
        <RenderPlayers players={players} setPlayers={setPlayers} />
        <ValidGroup players={players} valid={valid} setValid={setValid} />
      </PlayerContext.Provider>
    </div>
  );
}

export default App;
