import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Menu, MenuButton, MenuList, Text, HStack, Skeleton, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import styles from "../styles/AuthMenu.module.scss"
import AuthNav from "./AuthNavButtons"
import UnAuthNav from "./UnAuthNavButtons"
import { useSession } from "next-auth/react"
import { useMeQuery } from "../utils/userApi"

const AuthMenu = () => {
  const { status, data: session } = useSession()

  const { data: meQuery, isLoading, refetch } = useMeQuery()
  const [loginOpen, setLoginOpen] = useState(false)
  const [username, setUsername] = useState("Signed Out")

  const ToggleOpen = () => {
    setLoginOpen(!loginOpen)
  }

  useEffect(() => {
    if (status === "authenticated" && isLoading === false && meQuery === undefined) {
      refetch()
    }
    if (session && status === "authenticated" && isLoading === false && meQuery?.user?.username) {
      setUsername(meQuery.user.username)
    }
  }, [status, session, meQuery?.user, isLoading])



  return (
    <Skeleton isLoaded={!isLoading}>
      <Box className={styles.Menu}>
        <Menu>
          <MenuButton
            onClick={ToggleOpen}
            className={styles.MenuButton} margin={'0'}>
            <HStack>
              <Text>
                {username}
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
    </Skeleton>
  )
}

export default AuthMenu


