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
  // const [currentRoll, setCurrentRoll] = useState<
  //   Array<PlayerObject> | undefined
  // >(undefined);

  const [showPlayers, setShowPlayers] = useState(true);
  const [valid, setValid] = useState<boolean>(false);

  const removePlayer = (id: number) => {
    DeletePlayer(id, players!)
      .then((res) => {setPlayers(res)})
      .catch((err) => console.log(err));
  };

  const updatePlayer = (player: PlayerObject) => {
    PlayerUpdate(player, players!)
      .then((res) => {
        setPlayers(res);
        const newGroup = createInGroup(res!);
        setInGroup(newGroup);
      })
      .catch((err) => console.log(err));
  };
  const addPlayer = (newPlayer: PlayerFormObject):PlayerObject => {
    let responsePlayer = {
      ...blankPlayer,
      id: 99999,
      user_id: "placeHolder",
      createdAt: "placeHolder",
      updatedAt: "placeHolder",
    };
  NewPlayer(newPlayer, players!)
      .then((res) => {
        setPlayers(res.players);
        responsePlayer = res.newPlayer;
      })
      .catch((err) => console.log(err));
    return responsePlayer;
  };

  function toggleShowPlayers() {
    setShowPlayers(!showPlayers);
  }
  const blankPlayer: PlayerFormObject = {
    player_name: "",
    tank: false,
    healer: false,
    dps: false,
    locked: false,
    in_the_roll: false,
    user_id: ""
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
