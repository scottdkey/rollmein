// eslint-disable-next-line
import React from "react";
import RenderGroup from "./RenderGroup";
import { usePlayerData } from "./providers/PlayerProvider";
import axios from "axios"

const FreeForAllRoll = () => {


  const { valid, setCurrentRoll, outGroup, setOutGroup, currentRoll } = usePlayerData()!;

  const rollForGroup = async () => {
    const {data} = await axios.get('/api/v1/rolls/ffa')
    setCurrentRoll(data.players);
    setOutGroup(data.remaining);
  };

  return (
    <>
      <button disabled={valid === false} onClick={rollForGroup}>
        FFA Roll!
      </button>
      <RenderGroup players={currentRoll!} header={"Players"} />
      <RenderGroup players={outGroup!} header={"Not in the roll"} />
    </>
  );
};

export default FreeForAllRoll;
