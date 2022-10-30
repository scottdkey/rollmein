import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"

import LoginMenu from "./LoginMenu"
import RegisterMenu from "./RegisterMenu"

const UnAuthComponents = (): JSX.Element => {
  return (
    <Tabs margin={'0'}>
      <TabList>
        <Tab>Login</Tab>
        <Tab >Register</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <LoginMenu />
        </TabPanel>
        <TabPanel>
          <RegisterMenu />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default UnAuthComponents