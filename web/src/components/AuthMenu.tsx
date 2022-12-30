import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, MenuList, Text, HStack, Skeleton } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import styles from "../styles/AuthMenu.module.scss"
import AuthNav from "./AuthNavButtons"
import UnAuthNav from "./UnAuthNavButtons"
import { useSession } from "next-auth/react"


const AuthMenu = () => {
  const { data: session, status } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)

  const ToggleOpen = () => {
    setLoginOpen(!loginOpen)
  }
  
  const getDisplayUsername = (username: string | null | undefined) => {
    if (username === null) {
      return 'No Username Set'
    }
    return username
  }

  return (
    <Skeleton isLoaded={status !== 'loading'}>
      <div className={styles.Menu}>
        <Menu>
          <MenuButton
            onClick={ToggleOpen}
            className={styles.MenuButton} margin={'0'}>
            <HStack>
              <Text>
                {status === "authenticated" ? getDisplayUsername(session.user.username) : 'Signed Out'}
              </Text>
              {loginOpen ?
                <ChevronUpIcon /> : <ChevronDownIcon />}
            </HStack>

          </MenuButton>
          <MenuList className={styles.MenuList} margin={'0'}>
            {status === "authenticated" ?
              <AuthNav /> : <UnAuthNav />}
          </MenuList>
        </Menu>
      </div>
    </Skeleton>
  )
}

export default AuthMenu


