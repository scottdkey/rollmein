import React, { useState } from "react";
import { rollByRole } from "./utils/GroupRollLogic";
import { PlayerObject } from "./utils/Interfaces";
import RenderGroup from "./RenderGroup";

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
    setTank(players.tank);
    setHealer(players.healer);
    setDps(players.dps);
    setOutOfGroup(players.remainder);
  };

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
        <RenderGroup players={dps!} header={"Dps"} />
        <RenderGroup players={outOfGroup!} header={"Out of Current Roll"} />
      </div>
    </>
  );
};

export default RollByRole;
