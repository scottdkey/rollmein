import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { PlayerObject } from "./providers/interfaces";
import RollByRole from "./RollByRole";
import FreeForAllRoll from "./FreeForAllRoll";


type GroupRollProps = {
  valid: boolean;
  inGroup: Array<PlayerObject>;
};

const GroupRoll = ({ valid, inGroup }: GroupRollProps) => {
  const [rollGroup, setRollGroup] = useState<Array<PlayerObject>>();
  const [freeForAllValid, setFreeForAllValid] = useState(false);




  useEffect(() => {
    const inCheck = () => {
      if (inGroup && inGroup.length <= 6) {
        setFreeForAllValid(true);
      } else {
        setFreeForAllValid(false);
      }
    };
    setRollGroup(inGroup);
    inCheck();
  }, [valid, inGroup]);

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
          <FreeForAllRoll valid={freeForAllValid} rollGroup={rollGroup!} />
        </TabPanel>
      </Tabs>
    </>
  );
};

export default GroupRoll;
