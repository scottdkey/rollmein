import React, { useState } from "react";
import { rollByRole } from "./providers/GroupRollLogic";
import { PlayerObject } from "./providers/interfaces";
import RenderRemaining from "./RenderRemaining";

type RollByRoleProps = {
  valid: boolean;
  rollGroup: Array<PlayerObject>;
};

const RollByRole = ({ valid, rollGroup }: RollByRoleProps) => {
  const [tank, setTank] = useState<PlayerObject>();
  const [healer, setHealer] = useState<PlayerObject>();
  const [outOfGroup, setOutOfGroup] = useState<Array<PlayerObject>>();
  const [dps, setDps] = useState<Array<PlayerObject>>();

  const rollForGroup = () => {
    const players = rollByRole(rollGroup!);
    setTank(players.t);
    setHealer(players.h);
    setDps(players.d.newDPS);
    setOutOfGroup(players.d.players);
  };

  console.log(outOfGroup);
  return (
    <>
      <button disabled={valid === false} onClick={rollForGroup}>
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
        <RenderRemaining players={dps!} header={"Dps"} />
        <RenderRemaining players={outOfGroup!} header={"Out of Current Roll"} />
      </div>
    </>
  );
};

export default RollByRole;
