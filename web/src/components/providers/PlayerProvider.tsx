// eslint-disable-next-line
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  PlayerObject,
  PlayerContextType,
  PlayerFormObject,
} from "../utils/Interfaces";
// import { playersPlaceHolder } from "./databasePlaceholder";
import {
  PlayerUpdate,
  NewPlayer,
  DeletePlayer,
  GetPlayers,
} from "../utils/PlayerCRUD";
// import { createInGroup, blankPlayer } from "../utils/BaseAppLogic";
import { useAuth } from "./AuthProvider";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProvider({ children }: any) {
  const { authenticated, user } = useAuth()!;
  const [players, setPlayers] = useState<Array<PlayerObject> | undefined>(
    undefined
  );
  const [inGroup, setInGroup] = useState<Array<PlayerObject> | undefined>(
    undefined
  );

  const removePlayer = (id: number) => {
    DeletePlayer(id, players!, setPlayers);
  };

  const updatePlayer = (player: PlayerObject) => {
    PlayerUpdate(player, players!, setPlayers);
  };

  const addPlayer = (newPlayer: PlayerFormObject) => {
    NewPlayer(newPlayer, players!, user!.id, setPlayers);
  };
  const inGroupCount = inGroup ? inGroup.length : 0;
  useEffect(() => {
    if (authenticated) {
      GetPlayers(user!.id, setPlayers, setInGroup);
    }
  }, [authenticated, user]);

  return (
    <PlayerContext.Provider
      value={{
        players,
        setPlayers,
        inGroup,
        setInGroup,
        removePlayer,
        updatePlayer,
        addPlayer,
        inGroupCount,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

const usePlayerData = () => useContext(PlayerContext);

export { PlayerProvider, usePlayerData };
