import React from "react";
import RenderPlayers from "./components/renderPlayers";
import PlayerContext from "./components/providers/PlayerContext";
import { playersPlaceHolder } from "./components/providers/databasePlaceholder";

function App() {
  return (
    <div className="App">
      <PlayerContext.Provider value={playersPlaceHolder}>
        Roll Me in
        {/* <Guild /> */}
        <RenderPlayers />
        {/* <AddPlayer players={currentPlayers} setPlayers={setCurrentPlayers} /> */}
      </PlayerContext.Provider>
    </div>
  );
}

export default App;
