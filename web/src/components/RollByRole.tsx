import React, { useState } from 'react'
import { rollByRole } from "./providers/GroupRollLogic"
import { PlayerObject } from "./providers/interfaces";
import RenderGroup from './RenderGroup';
import RenderSingle from './RenderSingle';


type RollByRoleProps = {
  valid: boolean,
  rollGroup: Array<PlayerObject>
}

const RollByRole = ({ valid, rollGroup }: RollByRoleProps) => {

  const [tank, setTank] = useState<PlayerObject>();
  const [healer, setHealer] = useState<PlayerObject>();
  const [outOfGroup, setOutOfGroup] = useState<Array<PlayerObject>>();
  const [dps, setDps] = useState<Array<PlayerObject>>();

  const rollForGroup = async () => {
    const players = await rollByRole(rollGroup!);
    setTank(players.t);
    setHealer(players.h);
    setDps(players.d.newDPS);
    setOutOfGroup(players.d.players);
  };

  return (
    <>
      <button disabled={valid === false} onClick={rollForGroup}>
        Roll!
      </button>
      <div>

        <RenderSingle player={tank!} header={"Tank"} />
        <RenderSingle player={healer!} header={"Healer"} />
        <RenderGroup players={dps!} header={"Dps"} />
        <RenderGroup players={outOfGroup!} header={"Out of Current Roll"} />
      </div>
    </>
  )
}

export default RollByRole