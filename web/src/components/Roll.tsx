// eslint-disable-next-line
import React from "react";
import RollByRole from "./RollByRole";
import FreeForAllRoll from "./FreeForAllRoll";
import ValidGroup from "./ValidGroup";

const GroupRoll = () => (
  <>
    <ValidGroup />
    <RollByRole />
    <FreeForAllRoll />
  </>
);

export default GroupRoll;
