import React, { useState, useContext, useEffect } from "react";
import RenderPlayers from "./components/renderPlayers";
import PlayerContext from "./components/providers/PlayerContext";
import { playersPlaceHolder } from "./components/providers/databasePlaceholder";
import ValidGroup from "./components/ValidGroup";
import GroupRoll from "./components/groupRoll";
import {
  validCheck,
  createInGroup,
} from "./components/providers/BaseAppLogic";

function App() {
  const playerContext = useContext(PlayerContext);
  const [players, setPlayers] = useState(playerContext);
  const [valid, setValid] = useState(false);
  const [inGroup, setInGroup] = useState([]);
  const [theme, setTheme] = useState("lightTheme");

  useEffect(() => {
    const group = createInGroup(players);
    setInGroup(group);
    setValid(validCheck(group));
  }, [players]);
  return (
    <div className="App">
      <PlayerContext.Provider value={playersPlaceHolder}>
        <h1>Roll Me in</h1>
        <RenderPlayers players={players} setPlayers={setPlayers} />
        <ValidGroup inGroup={inGroup} players={players} valid={valid} />
        <GroupRoll valid={valid} inGroup={inGroup} />
      </PlayerContext.Provider>
    </div>
  );
}

export default App;
