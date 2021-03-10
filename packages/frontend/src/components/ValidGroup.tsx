// eslint-disable-next-line
import React from "react";

import { usePlayerData } from "./providers/PlayerProvider";

import Tank from "./assets/images/TANK.png";
import Dps from "./assets/images/DPS.png";
import Healer from "./assets/images/HEALER.png";

import ValidRole from "./ValidRole";

const ValidGroup = () => {
  const { roleCounts, inGroup } = usePlayerData()!;

  return (
    <div className="valid-group">
      <ValidRole
        roleCount={roleCounts.tanks}
        image={Tank}
        miniumNumber={1}
        toolTipText={TankText}
        altImageText="Tank"
      />
      <ValidRole
        roleCount={roleCounts.dps}
        image={Dps}
        miniumNumber={3}
        toolTipText={DPSText}
        altImageText="DPS"
      />
      <ValidRole
        roleCount={roleCounts.healers}
        image={Healer}
        miniumNumber={1}
        toolTipText={HealerText}
        altImageText="Healer"
      />

      {inGroup ? (
        <ValidRole
          roleCount={roleCounts.inGroupCount}
          image={Healer}
          miniumNumber={6}
          toolTipText={EnoughPlayersText}
          altImageText="Player"
        />
      ) : null}
    </div>
  );
};

export default ValidGroup;

const TankText = "You must have at least 1 tank";
const HealerText = "You must have at least 1 healer";
const DPSText = "You must have at least 3 DPS";
const EnoughPlayersText =
  "You must have at least 6 players or rolling is pointless";
