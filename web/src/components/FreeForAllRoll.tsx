// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { PlayerObject } from "../types/Interfaces";
import { FFARoll, inCheck } from "./utils/GroupRollLogic";
import RenderGroup from "./RenderGroup";
import { usePlayerData } from "./providers/PlayerProvider";

const FreeForAllRoll = () => {
  const [players, setPlayers] = useState<Array<PlayerObject>>();
  const [outGroup, setOutGroup] = useState<Array<PlayerObject>>();
  const [valid, setValid] = useState(false);

  const { inGroup, inGroupCount } = usePlayerData()!;

  const rollForGroup = async () => {
    const res = await FFARoll(inGroup!);
    setPlayers(res.players);
    setOutGroup(res.remaining);
  };
  useEffect(() => {
    const checkValid = inCheck(inGroupCount);
    setValid(checkValid);
  }, [inGroup, inGroupCount]);

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
