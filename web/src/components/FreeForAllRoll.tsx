import React, { useState, useEffect } from "react";
import { PlayerObject } from "./utils/Interfaces";
import { FFARoll } from "./utils/GroupRollLogic";
import RenderGroup from "./RenderGroup";

type FreeForAllRollType = {
  rollGroup: Array<PlayerObject>;
};

const FreeForAllRoll = ({ rollGroup }: FreeForAllRollType) => {
  const [players, setPlayers] = useState<Array<PlayerObject>>();
  const [outGroup, setOutGroup] = useState<Array<PlayerObject>>();
  const [valid, setValid] = useState(false);

  const rollForGroup = async() => {
    const res = await FFARoll(rollGroup);
    setPlayers(res.players);
    setOutGroup(res.remaining);
  };
  useEffect(() => {
    const inCheck = () => {
      if (rollGroup && rollGroup.length <= 5) {
        setValid(true);
      } else {
        setValid(false);
      }
    };
    inCheck();
  }, [valid, rollGroup]);

  return (
    <>
      <button disabled={valid === true} onClick={rollForGroup}>
        Roll!
      </button>
      <RenderGroup players={players!} header={"Players"} />
      <RenderGroup players={outGroup!} header={"Not in the roll"} />
    </>
  );
};

export default FreeForAllRoll;
