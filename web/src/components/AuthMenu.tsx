import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { HStack, Menu, MenuButton, Button, MenuList, MenuItem, Tabs, TabList, Tab, TabPanels, TabPanel, useColorModeValue, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider"
import { deleteCookie } from "../utils/cookieHelpers"
import styles from "../styles/AuthMenu.module.scss"
import LoginMenu from "./LoginMenu"
import RegisterMenu from "./RegisterMenu"
import AuthComponents from "./AuthComponents"


const AuthMenu = () => {
  const { auth, setAuth, user } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const textColor = useColorModeValue("gray.800", "gray.300")
  const buttonColor = useColorModeValue("blue.300", "blue.600")
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [keepMenuOpen, setKeepMenuOpen] = useState(true)


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


  const ToggleOpen = () => {
    setLoginOpen(!loginOpen)
  }

  return (
    <div className={styles.Menu}>
      <Menu>
        <MenuButton
          onClick={ToggleOpen}
          className={styles.MenuButton} margin={'0'}>
          {auth ? user?.username : 'Signed Out'}
          {loginOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </MenuButton>
        <MenuList className={styles.MenuList} margin={'0'}>
          {auth ?
            <AuthComponents /> : <UnAuthComponents />}
        </MenuList>
      </Menu>
    </div>
  )
}

export default AuthMenu


