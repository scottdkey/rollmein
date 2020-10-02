// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { rollByRole } from "./utils/GroupRollLogic";
import { PlayerObject } from "./utils/Interfaces";
import RenderGroup from "./RenderGroup";
import { usePlayerData } from "./providers/PlayerProvider";
import { validCheck } from "./utils/BaseAppLogic";
import ValidGroup from "./ValidGroup";

const RollByRole = () => {
  const [tank, setTank] = useState<PlayerObject>();
  const [healer, setHealer] = useState<PlayerObject>();
  const [outOfGroup, setOutOfGroup] = useState<Array<PlayerObject>>();
  const [dps, setDps] = useState<Array<PlayerObject>>();
  const [valid, setValid] = useState<boolean>(false);

  const { inGroup } = usePlayerData()!;

  const rollForGroup = () => {
    const players = rollByRole(inGroup!);
    setTank(players.tank);
    setHealer(players.healer);
    setDps(players.dps);
    setOutOfGroup(players.remainder);
  };

  useEffect(() => {
    setValid(validCheck(inGroup!));
  }, [inGroup]);

  if (outOfGroup === undefined) {
    return (
      <>
        <button disabled={!valid} onClick={rollForGroup}>
          Roll!
        </button>
        <ValidGroup />
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
              {tank.name}
            </>
          )}
          {healer === undefined ? null : (
            <>
              <h3>Healer:</h3>
              {healer.name}
            </>
          )}
          <RenderGroup players={dps!} header={"Dps"} />
          <RenderGroup players={outOfGroup!} header={"Out of Current Roll"} />
        </div>
      </>
    );
  }
};

export default RollByRole;
