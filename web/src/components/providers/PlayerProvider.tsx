// eslint-disable-next-line
import React, { createContext, useState, useEffect, useContext } from "react";

import {
  PlayerObject,
  PlayerContextType,
  PlayerFormObject,
  BlankPlayerObject,
  roleCountInterface,
} from "../../types/Interfaces";

import {
  PlayerUpdate,
  NewPlayer,
  DeletePlayer,
  GetPlayers,
} from "../utils/PlayerCRUD";

import { createInGroup, countRoles, validCheck } from "../utils/BaseAppLogic";
import { useAuth } from "./AuthProvider";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProvider({ children }: any) {
  const { authenticated, user } = useAuth()!;
  const [players, setPlayers] = useState<Array<PlayerObject> | undefined>(
    undefined
  );
  const [roleCounts, setRoleCounts] = useState<roleCountInterface>({
    tanks: 0,
    healers: 0,
    dps: 0,
    inGroupCount: 0,
  });
  const [inGroup, setInGroup] = useState<Array<PlayerObject> | undefined>(
    undefined
  );
  const [currentRoll, setCurrentRoll] = useState<
    Array<PlayerObject> | undefined
  >(undefined);

  
  const [showPlayers, setShowPlayers] = useState(true);
  const [valid, setValid] = useState<boolean>(false);

  const removePlayer = (id: number) => {
    DeletePlayer(id, players!)
      .then((res) => setPlayers(res))
      .catch((err) => console.log(err));
  };

  const updatePlayer = (player: PlayerObject) => {
    PlayerUpdate(player, players!)
      .then((res) => {
        setPlayers(res);
        const newGroup = createInGroup(res!);
        console.log(newGroup);
        setInGroup(newGroup);
      })
      .catch((err) => console.log(err));
  };

  const addPlayer = (newPlayer: PlayerFormObject) => {
    NewPlayer(newPlayer, players!, user!.id)
      .then((res) => setPlayers(res))
      .catch((err) => console.log(err));
  };

  function toggleShowPlayers() {
    setShowPlayers(!showPlayers);
  }
  const blankPlayer: BlankPlayerObject = {
    name: "",
    tank: false,
    healer: false,
    dps: false,
    locked: false,
    in: false,
  };

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

  useEffect(() => {
    setValid(validCheck(players!));
    setRoleCounts(countRoles(players!));
  }, [players]);

  return (
    <PlayerContext.Provider
      value={{
        players,
        setPlayers,
        blankPlayer,
        inGroup,
        setInGroup,
        removePlayer,
        updatePlayer,
        addPlayer,
        showPlayers,
        roleCounts,
        toggleShowPlayers,
        valid,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

const usePlayerData = () => useContext(PlayerContext);

export { PlayerProvider, usePlayerData };
