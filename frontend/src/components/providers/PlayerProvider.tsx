// eslint-disable-next-line
import React, { createContext, useState, useEffect, useContext } from "react";

import {
  PlayerObject,
  PlayerFormObject,
  roleCountInterface,
} from "../../types/Interfaces";

import { PlayerContextType } from "../../types/Types";
import {
  PlayerUpdate,
  NewPlayer,
  GetPlayers,
} from "../utils/PlayerCRUD";

import { useAuth } from "./AuthProvider";
import Axios from "axios";
import { validCheck } from "../utils/BaseAppLogic";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

function PlayerProvider({ children }: any) {
  const { authenticated, uuid } = useAuth()!;
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
  const [outGroup, setOutGroup] = useState<Array<PlayerObject> | undefined>();
  const [currentRoll, setCurrentRoll] = useState<
    Array<PlayerObject> | undefined
  >();
  const [showPlayers, setShowPlayers] = useState(true);
  const [valid, setValid] = useState<boolean>(false);

  const removePlayer = async (id: number) => {
    const newPlayers: Array<PlayerObject> = players!.filter(
      (player: PlayerObject) => player.id !== id
    );
    setPlayers(newPlayers);
  };

  const updatePlayer = async (player: PlayerObject): Promise<PlayerObject> => {
    const res = await PlayerUpdate(player);
    return res;
  };
  const addPlayer = async (
    newPlayer: PlayerFormObject
  ): Promise<PlayerObject> => {
    const res = await NewPlayer(newPlayer);
    const newPlayers = players?.concat(res);
    console.log(newPlayers);
    setPlayers(newPlayers);
    return res;
  };

  function toggleShowPlayers() {
    setShowPlayers(!showPlayers);
  }
  const blankPlayer: PlayerFormObject = {
    playerName: "",
    tank: false,
    healer: false,
    dps: false,
    locked: false,
    inTheRoll: false,
    userId: "",
  };
  const pullCountFromDB = async () => {
    const res = await Axios.get("/api/v1/rolls/count");
    setRoleCounts(res.data);
    validCheck(res.data);
  };



  useEffect(() => {
    const pullPlayersFromDb = async () => {
      const res = await GetPlayers(uuid!);
      setPlayers(res);
    };
    if (authenticated) {
      pullPlayersFromDb();
      pullCountFromDB();
    }
  }, [authenticated, uuid]);

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
        setValid,
        outGroup,
        setOutGroup,
        currentRoll,
        setCurrentRoll,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

const usePlayerData = () => useContext(PlayerContext);

export { PlayerProvider, usePlayerData };
