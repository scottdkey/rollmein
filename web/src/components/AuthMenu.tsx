import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, MenuList, useColorModeValue } from "@chakra-ui/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useAuth } from "../providers/AuthProvider"
import styles from "../styles/AuthMenu.module.scss"


const AuthMenu = () => {
  const { auth, setAuth, user } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const textColor = useColorModeValue("gray.800", "gray.300")
  const buttonColor = useColorModeValue("blue.300", "blue.600")
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [keepMenuOpen, setKeepMenuOpen] = useState(true)

  const AuthNav = dynamic(() => import('./AuthNavButtons'))
  const UnAuthNav = dynamic(() => import('./UnAuthNavButtons'))


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
            <AuthNav /> : <UnAuthNav />}
        </MenuList>
      </Menu>
    </div>
  )
}

export default AuthMenu


