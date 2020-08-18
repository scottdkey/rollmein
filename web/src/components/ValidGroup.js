import React, { useState, useEffect } from "react";

const GetAGroup = ({ players }) => {
  const [tanks, setTanks] = useState(0);
  const [dps, setDps] = useState(0);
  const [healers, setHealers] = useState(0);
  const [valid, setValid] = useState(true);

  const countRole = async (playerArray, role, stateToUpadate) => {
    const currentCount = playerArray.reduce((n, player) => {
      return n + (player[role] === true);
    }, 0);
    await stateToUpadate(currentCount, role);
  };

  const validGroupCheck = (tankCount, dpsCount, healersCount) => {
    if (
      tankCount > 0 &&
      dpsCount > 2 &&
      healersCount > 0 &&
      players.length > 4
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  useEffect(() => {
    countRole(players, "tank", setTanks);
    countRole(players, "dps", setDps);
    countRole(players, "healer", setHealers);
    validGroupCheck(tanks, dps, healers);
  }, [players, validGroupCheck]);
  return (
    <>
      <div>Number of Tanks: {tanks}</div>
      <div>Number of DPS: {dps}</div>
      <div>Number of Healers: {healers}</div>
      <div>This group is {valid ? "valid" : "invalid"}</div>
      <div>
        This Group has {players.length} players in the roll.{" "}
        {players.length > 4 ? null : "You must have at least 5 players"}
      </div>
    </>
  );
};

export default GetAGroup;
