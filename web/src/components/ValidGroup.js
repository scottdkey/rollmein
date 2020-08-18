import React, { useState, useEffect } from "react";
import { countRoles } from "./providers/BaseAppLogic";

const GetAGroup = ({ players, inGroup, valid }) => {
  const [tanks, setTanks] = useState(0);
  const [dps, setDps] = useState(0);
  const [healers, setHealers] = useState(0);

  useEffect(() => {
    const roleCounts = countRoles(players);
    setTanks(roleCounts.tanks);
    setDps(roleCounts.dps);
    setHealers(roleCounts.healers);
  }, [players]);
  return (
    <>
      <div>Number of Tanks: {tanks}</div>
      <div>Number of DPS: {dps}</div>
      <div>Number of Healers: {healers}</div>
      <div>This group is {valid ? "valid" : "invalid"}</div>
      <div>
        {inGroup.length >= 6 ? null : (
          <li>You must have at least 6 players or rolling is pointless</li>
        )}
        {tanks > 0 ? null : <li>You must have at least 1 tank</li>}
        {healers > 0 ? null : <li>You must have at least 1 healer</li>}
        {dps > 2 ? null : <li>You must have at least 3 DPS</li>}
      </div>
    </>
  );
};

export default GetAGroup;
