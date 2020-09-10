import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { PlayerObject } from "./providers/interfaces";
import RollByRole from "./RollByRole";
import FreeForAllRoll from "./FreeForAllRoll";
import "react-tabs/style/react-tabs.scss";

type GroupRollProps = {
  valid: boolean;
  inGroup: Array<PlayerObject>;
};

const GroupRoll = ({ valid, inGroup }: GroupRollProps) => {
  const [rollGroup, setRollGroup] = useState<Array<PlayerObject>>();

  useEffect(() => {
    setRollGroup(inGroup);
  }, [inGroup, valid]);

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Roll by Role</Tab>
          <Tab>Free for all Roll</Tab>
        </TabList>
        <TabPanel>
          <RollByRole valid={valid!} rollGroup={rollGroup!} />
        </TabPanel>
        <TabPanel>
          <FreeForAllRoll rollGroup={rollGroup!} />
        </TabPanel>
      </Tabs>
    </>
  );
};

export default GroupRoll;
