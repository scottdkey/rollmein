// eslint-disable-next-line
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RollByRole from "./RollByRole";
import FreeForAllRoll from "./FreeForAllRoll";
import "react-tabs/style/react-tabs.scss";

const GroupRoll = () => (
  <>
    <Tabs>
      <TabList>
        <Tab>Roll by Role</Tab>
        <Tab>Free for all Roll</Tab>
      </TabList>
      <TabPanel>
        <RollByRole />
      </TabPanel>
      <TabPanel>
        <FreeForAllRoll />
      </TabPanel>
    </Tabs>
  </>
);

export default GroupRoll;
