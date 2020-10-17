// eslint-disable-next-line
import React, { useState } from "react";
import { PlayerObject } from "../types/Interfaces";
import { FFARoll } from "./utils/GroupRollLogic";
import RenderGroup from "./RenderGroup";
import { usePlayerData } from "./providers/PlayerProvider";

const FreeForAllRoll = () => {
  const [players, setPlayers] = useState<Array<PlayerObject>>();
  const [outGroup, setOutGroup] = useState<Array<PlayerObject>>();

  const { inGroup, roleCounts, valid } = usePlayerData()!;

  const rollForGroup = async () => {
    const res = await FFARoll(inGroup!);
    setPlayers(res.players);
    setOutGroup(res.remaining);
  };

  return (
    <>
      <button disabled={valid === false} onClick={rollForGroup}>
        FFA Roll!
      </button>
      <RenderGroup players={players!} header={"Players"} />
      <RenderGroup players={outGroup!} header={"Not in the roll"} />
    </>
  );
};

export default FreeForAllRoll;
