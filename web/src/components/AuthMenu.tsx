import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, MenuList, Text, HStack, Skeleton, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import styles from "../styles/AuthMenu.module.scss"
import AuthNav from "./AuthNavButtons"
import UnAuthNav from "./UnAuthNavButtons"
import { useMeQuery } from "../utils/userApi"
import { useSession } from "next-auth/react"

const AuthMenu = () => {

  const { status, data: session } = useSession()
  const [loginOpen, setLoginOpen] = useState(false)

  const { data, isLoading } = useMeQuery()
  const [username, setUsername] = useState(session?.user?.username)

  const ToggleOpen = () => {
    setLoginOpen(!loginOpen)
  }

  useEffect((() => {
    if (!data?.user && session?.user?.username) {
      setUsername(session.user.username)
    }
    if (data?.user?.username) {
      setUsername(data.user.username)
    }
  }), [data, session?.user])

  if (isLoading) {
    return (
      <Box className={styles.Menu}>
        loading
      </Box>
    )
  }

  return (
    <Box className={styles.Menu}>
      <Menu>
        <MenuButton
          onClick={ToggleOpen}
          className={styles.MenuButton} margin={'0'}>
          <HStack>
            <Text maxW={'28'}>
              {status === 'authenticated' ? username : "Signed out"}
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
    </Box>
  )
}

export default AuthMenu


