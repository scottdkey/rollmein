import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, MenuList, useColorModeValue, Text, HStack, Skeleton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useAuth } from "../providers/AuthProvider"
import styles from "../styles/AuthMenu.module.scss"
import AuthNav from "./AuthNavButtons"
import UnAuthNav from "./UnAuthNavButtons"


const AuthMenu = () => {
  const { auth, user, loading } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)


  const ToggleOpen = () => {
    setLoginOpen(!loginOpen)
  }
  const getDisplayUsername =(username: string | null | undefined) => {
    if(username === null){
      return 'No Username Set'
    }
    return username
  }

  return (
    <Skeleton isLoaded={!loading}>
      <div className={styles.Menu}>
        <Menu>
          <MenuButton
            onClick={ToggleOpen}
            className={styles.MenuButton} margin={'0'}>
            <HStack>
              <Text>
                {auth ? getDisplayUsername(user?.username) : 'Signed Out'}
              </Text>
              {loginOpen ?
                <ChevronUpIcon /> : <ChevronDownIcon />}
            </HStack>

          </MenuButton>
          <MenuList className={styles.MenuList} margin={'0'}>
            {auth ?
              <AuthNav /> : <UnAuthNav />}
          </MenuList>
        </Menu>
      </div>
    </Skeleton>
  )
}

export default AuthMenu


