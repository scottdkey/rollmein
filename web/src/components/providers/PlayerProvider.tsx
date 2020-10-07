// eslint-disable-next-line
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  PlayerObject,
  PlayerContextType,
  PlayerFormObject,
} from "../utils/Interfaces";
import {
  PlayerUpdate,
  NewPlayer,
  DeletePlayer,
  GetPlayers,
} from "../utils/PlayerCRUD";

import { createInGroup } from "../utils/BaseAppLogic";

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
  const [showPlayers, setShowPlayers] = useState(true);

  const removePlayer = (id: number) => {
    DeletePlayer(id, players!)
      .then((res) => setPlayers(res))
      .catch((err) => console.log(err));
  };

  const updatePlayer = (player: PlayerObject) => {
    PlayerUpdate(player, players!)
      .then((res) => setPlayers(res))
      .catch((err) => console.log(err));
  };

  const addPlayer = (newPlayer: PlayerFormObject) => {
    NewPlayer(newPlayer, players!, user!.id)
      .then((res) => setPlayers(res))
      .catch((err) => console.log(err));
  };
  const inGroupCount = inGroup ? inGroup.length : 0;

  function toggleShowPlayers(){
    setShowPlayers(!showPlayers)
  }

  useEffect(() => {
    if (authenticated) {
      GetPlayers(user!.id)
        .then((res) => {
          setInGroup(createInGroup(res));
          setPlayers(res);
        })
        .catch((err) => console.log(err));
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
        showPlayers,
        toggleShowPlayers,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

const usePlayerData = () => useContext(PlayerContext);

export { PlayerProvider, usePlayerData };
