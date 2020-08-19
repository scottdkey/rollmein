import React, { useState, useEffect } from "react";

const GroupRoll = ({ valid, inGroup }) => {
  const [currentlyValid, setCurrentlyValid] = useState(valid);
  const [rollGroup, setRollGroup] = useState([]);
  const [tank, setTank] = useState({});
  const [healer, setHealer] = useState({});
  const [outOfGroup, setOutOfGroup] = useState([]);
  const [dps, setDps] = useState([]);

  const rollForRole = (role, arrayOfPlayers) => {
    const group = arrayOfPlayers.filter((player) => player[role] === true);
    const locked = group.filter((p) => p.locked === true);
    let pickedRole = {};
    if (locked.length > 0) {
      pickedRole = randomFromArray(locked);
    } else {
      pickedRole = randomFromArray(group);
    }

    return pickedRole;
  };

  const randomFromArray = (arrayOfPlayers) => {
    return arrayOfPlayers[Math.floor(Math.random() * arrayOfPlayers.length)];
  };

  const removePickFromGroup = (pickedPlayer, remainingPlayers) => {
    const newRollGroup = remainingPlayers.filter(
      (player) => player.id !== pickedPlayer.id
    );
    return newRollGroup;
  };

  const rollForGroup = () => {
    let remainingPlayers = inGroup;
    const t = rollForRole("tank", remainingPlayers);
    remainingPlayers = removePickFromGroup(t, remainingPlayers);
    const h = rollForRole("healer", remainingPlayers);
    remainingPlayers = removePickFromGroup(h, remainingPlayers);
    const d = rollForDps(remainingPlayers);

    setTank(t);
    setHealer(h);
    setDps(d.newDPS);
    setOutOfGroup(d.players);
  };

  const rollForDps = (remainingPlayers) => {
    let players = remainingPlayers;

    const newDPS = [];
    for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
      const pickedDPS = rollForRole("dps", players);
      newDPS.push(pickedDPS);
      players = removePickFromGroup(pickedDPS, players);
    }
    return { players, newDPS };
  };

  const RenderDPS = () =>
    dps.map((player) => (
      <div key={player.name + 10 + player.id}>{player.name}, </div>
    ));

  const OutOfGroup = () =>
    outOfGroup.map((player) => (
      <div key={player.name + 10 + player.id}>{player.name}, </div>
    ));

  useEffect(() => {
    setRollGroup(inGroup);
    console.log(dps);
  }, [valid, inGroup, dps]);

  return (
    <>
      <button disabled={!valid} onClick={rollForGroup}>
        Roll!
      </button>
      <div>
        <h1>current Group</h1>
        <h3>Tank:{tank ? tank.name : null} </h3>
        <h3>Healer:{healer ? healer.name : null}</h3>
        <h3>DPS:{dps.length < 1 ? null : <RenderDPS />}</h3>
        <h3>
          Not in Current Roll:{outOfGroup.length < 1 ? null : <OutOfGroup />}
        </h3>
      </div>
    </>
  );
};

export default GroupRoll;
