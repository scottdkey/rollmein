import React, { useState, useEffect } from 'react'
import { rollByRole } from "./providers/GroupRollLogic"
import { PlayerObject } from "./providers/interfaces";
import OutOfGroup from './OutOfGroup';
import RenderRemaining from './RenderRemaining';


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


  console.log(outOfGroup)
  return (
    <>
      <button disabled={valid === false} onClick={rollForGroup}>
        Roll!
      </button>
      <div>
        {tank === undefined ? null : <><h3>Tank: </h3>{tank.name}</>}
        {healer === undefined ? null : <><h3>Healer:</h3>{healer.name}</>}
        <RenderRemaining players={dps!} headerName={"Dps"} />
        <RenderRemaining players={outOfGroup!} headerName={"Out of Current Roll"} />
      </div>
    </>
  )
}

export default RollByRole