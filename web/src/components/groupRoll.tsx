import React, { useState, useEffect } from "react";
import { PlayerObject, DPSObject } from "./providers/interfaces";

type GroupRollProps = {
  valid: boolean;
  inGroup: Array<PlayerObject>;
};

const GroupRoll = ({ valid, inGroup }: GroupRollProps) => {
  const [rollGroup, setRollGroup] = useState<Array<PlayerObject>>();
  const [freeForAllValid, setFreeForAllValid] = useState(false);
  const [tank, setTank] = useState<PlayerObject>();
  const [healer, setHealer] = useState<PlayerObject>();
  const [outOfGroup, setOutOfGroup] = useState<Array<PlayerObject>>();
  const [dps, setDps] = useState<Array<PlayerObject>>();

  const inCheck = () => {
    if (inGroup && inGroup.length <= 6) {
      console.log("inCheck says true");
      setFreeForAllValid(true);
    } else {
      console.log("incheck says no");
      setFreeForAllValid(false);
    }
  };

  const rollForGroup = async () => {
    const allTheRoles = await rollByRoll(rollGroup);
    setTank(t);
    setHealer(h);
    setDps(d.newDPS);
    setOutOfGroup(d.players);
  };
  const rollByRoll = (arrayOfPlayers: Array<PlayerObject>) => {
    let remainingPlayers = arrayOfPlayers;
    const t: PlayerObject = rollForRole("tank", remainingPlayers);
    remainingPlayers = removePickFromGroup(t, remainingPlayers);
    const h: PlayerObject = rollForRole("healer", remainingPlayers);
    remainingPlayers = removePickFromGroup(h, remainingPlayers);
    const d: DPSObject = rollForDps(remainingPlayers);
    return { t, h, d };
  };

  const rollForDps = (remainingPlayers: Array<PlayerObject>) => {
    let players = remainingPlayers;

    const newDPS: Array<PlayerObject> = [];
    for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
      const pickedDPS = rollForRole("dps", players);
      newDPS.push(pickedDPS);
      players = removePickFromGroup(pickedDPS, players);
    }
    return { players, newDPS };
  };

  const RenderDPS = () => (
    <>
      {dps!.map((player: PlayerObject) => (
        <div key={player.name + 10 + player.id}>{player.name}, </div>
      ))}
    </>
  );

  const OutOfGroup = () =>
    outOfGroup ? (
      <>
        {outOfGroup.map((player: PlayerObject) => (
          <div key={player.name + 10 + player.id}>{player.name}, </div>
        ))}
      </>
    ) : null;

  useEffect(() => {
    setRollGroup(inGroup);
    inCheck();
  }, [valid, inGroup]);

  return (
    <>
      <button disabled={!valid === true} onClick={rollForGroup}>
        Roll!
      </button>
      <button disabled={freeForAllValid} onClick={rollForGroup}>
        Free For All Roll!
      </button>
      <div>
        <h1>current Group</h1>
        <h3>Tank:{tank ? tank.name : null} </h3>
        <h3>Healer:{healer ? healer.name : null}</h3>
        <h3>DPS:{dps !== undefined || 0 ? <RenderDPS /> : null}</h3>
        <h3>Not in Current Roll:{outOfGroup ? null : <OutOfGroup />}</h3>
      </div>
    </>
  );
};

export default GroupRoll;
