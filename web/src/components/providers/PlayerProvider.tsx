import React, { createContext, useState, useEffect, useContext } from "react";
import { PlayerObject } from "../utils/Interfaces";
import { playersPlaceHolder } from "./databasePlaceholder";
import { PlayerUpdate, NewPlayer, DeletePlayer } from "../utils/PlayerCRUD";
import { createInGroup, blankPlayer } from "../utils/BaseAppLogic";

type PlayerContextType = {
  players: Array<PlayerObject>;
  setPlayers: (value: Array<PlayerObject>) => void;
  inGroup: Array<PlayerObject>;
  setInGroup: (value: Array<PlayerObject>) => void;
  removePlayer: (value: number) => void;
  updatePlayer: (value: PlayerObject) => void;
  addPlayer: (value: PlayerObject) => void;
  inGroupCount: number;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProvider({ children }: any) {
  const [players, setPlayers] = useState<Array<PlayerObject>>(
    playersPlaceHolder
  );
  const [inGroup, setInGroup] = useState<Array<PlayerObject>>(blankPlayer);

  useEffect(() => {
    const currentPlayers: Array<PlayerObject> = players ? players : blankPlayer;
    const currentGroup: Array<PlayerObject> = createInGroup(currentPlayers);
    setInGroup(currentGroup);
  }, [players]);

  const removePlayer = (id: number) => {
    setPlayers(DeletePlayer(id, players));
  };

  const updatePlayer = (player: PlayerObject) => {
    setPlayers(PlayerUpdate(player, players));
  };

  const addPlayer = (newPlayer: PlayerObject) => {
    setPlayers(NewPlayer(newPlayer, players));
  };
  const inGroupCount = inGroup ? inGroup.length : 0;

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
