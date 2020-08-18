import React, { useState, useEffect } from "react";

const GetAGroup = ({ players, inGroup, setInGroup, valid, setValid }) => {
  const [tanks, setTanks] = useState(0);
  const [dps, setDps] = useState(0);
  const [healers, setHealers] = useState(0);
  const [numberInRoll, setNumberInRoll] = useState(0);

  const countRole = async (playerArray, role, stateToUpadate) => {
    const currentCount = playerArray.reduce((n, player) => {
      return n + (player[role] === true && player.in === true);
    }, 0);

    await stateToUpadate(currentCount, role);
  };

  const updateNumberInRoll = async () => {
    const inCount = players.reduce((n, player) => {
      return n + (player.in === true);
    }, 0);
    await setNumberInRoll(inCount);
    createInGroup();
  };

  const createInGroup = () => {
    const group = players.filter((player) => player.in === true);
    console.log(group);
    setInGroup(group);
  };

  const validGroupCheck = async (isValid) => {
    if (
      tanks < 0 &&
      dps < 2 &&
      healers < 0 &&
      players.length < 4 &&
      numberInRoll < 4
    ) {
      isValid(false);
    } else {
      isValid(true);
    }
  };

  useEffect(() => {
    countRole(players, "tank", setTanks);
    countRole(players, "dps", setDps);
    countRole(players, "healer", setHealers);

    updateNumberInRoll();
    validGroupCheck(setValid);
  }, [players, setValid]);
  return (
    <>
      <div>Number of Tanks: {tanks}</div>
      <div>Number of DPS: {dps}</div>
      <div>Number of Healers: {healers}</div>
      <div>This group is {valid ? "valid" : "invalid"}</div>
      <div>
        {numberInRoll > 4 ? null : <li>You must have at least 5 players</li>}
        {tanks > 0 ? null : <li>You must have at least 1 tank</li>}
        {healers > 0 ? null : <li>You must have at least 1 healer</li>}
        {dps > 2 ? null : <li>You must have at least 3 DPS</li>}
      </div>
    </>
  );
};

export default GetAGroup;
