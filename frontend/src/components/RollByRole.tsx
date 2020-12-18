// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { PlayerObject } from "../types/Interfaces";
import RenderGroup from "./RenderGroup";
import { usePlayerData } from "./providers/PlayerProvider";
import { validCheck } from "./utils/BaseAppLogic";
import axios from "axios"

const RollByRole = () => {
  const [tank, setTank] = useState<PlayerObject>();
  const [healer, setHealer] = useState<PlayerObject>();
  const [dps, setDps] = useState<Array<PlayerObject>>();

  const { inGroup, setOutGroup, outGroup, valid, setValid } = usePlayerData()!;

  const rollForGroup = async() => {
    const {data} = await axios.get('/api/v1/rolls/rbr')
    setTank(data.tank);
    setHealer(data.healer);
    setDps(data.dps);
    setOutGroup(data.remainder);
  };

  useEffect(() => {
    // const CurrentValid = validCheck(inGroup!);
    // setValid(CurrentValid);
  }, [inGroup, setValid]);

  if (outGroup === undefined) {
    return (
      <>
        <button disabled={!valid} onClick={rollForGroup}>
          Roll by Role!
        </button>
      </>
    );
  } else {
    return (
      <>
        <button disabled={!valid} onClick={rollForGroup}>
          Roll!
        </button>
        <div>
          {tank === undefined ? null : (
            <>
              <h3>Tank: </h3>
              {tank.playerName}
            </>
          )}
          {healer === undefined ? null : (
            <>
              <h3>Healer:</h3>
              {healer.playerName}
            </>
          )}
          <RenderGroup players={dps!} header={"Dps"} />
          <RenderGroup players={outGroup!} header={"Out of Current Roll"} />
        </div>
      </>
    );
  }
};

export default RollByRole;
