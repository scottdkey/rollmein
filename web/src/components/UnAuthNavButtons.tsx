import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import dynamic from "next/dynamic"

import RegisterMenu from "./RegisterMenu"
const LoginMenu = dynamic(() => import('./LoginMenu'), {
  suspense: true,
})

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