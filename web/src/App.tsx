import React, { useState, useContext, useEffect } from "react";
import RenderPlayers from "./components/renderPlayers";
import PlayerContext from "./components/providers/PlayerContext";
import { playersPlaceHolder } from "./components/providers/databasePlaceholder";
import ValidGroup from "./components/ValidGroup";
import GroupRoll from "./components/groupRoll";
import {
  validCheck,
  createInGroup,
  blankPlayer,
} from "./components/utils/BaseAppLogic";
import { PlayerObject } from "./components/utils/Interfaces";


function App() {
  const playerContext = useContext(PlayerContext);
  const [players, setPlayers] = useState<Array<PlayerObject>>(playerContext);
  const [valid, setValid] = useState(false);
  const [inGroup, setInGroup] = useState<Array<PlayerObject>>();
  // const [theme, setTheme] = useState("lightTheme");

  useEffect(() => {
    const currentPlayers: Array<PlayerObject> = players ? players : blankPlayer;
    const currentGroup: Array<PlayerObject> = createInGroup(currentPlayers);
    setInGroup(currentGroup);
    setValid(validCheck(currentGroup));
  }, [players]);
  return (
    <div className="App">
      <PlayerContext.Provider value={playersPlaceHolder}>
        <h1>Roll Me in</h1>
        <RenderPlayers players={players!} setPlayers={setPlayers} />
        <ValidGroup inGroup={inGroup!} players={players!} valid={valid} />
        <GroupRoll valid={valid} inGroup={inGroup!} />
      </PlayerContext.Provider>
    </div>
  );
}

export default App;
