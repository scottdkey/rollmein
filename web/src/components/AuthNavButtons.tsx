import { MenuItem } from "@chakra-ui/react"
import { useQueryClient } from "react-query"
import { useAuth } from "../providers/AuthProvider"
import { useLogoutMutation } from "../utils/authApi"
import { deleteCookie } from "../utils/cookieHelpers"
import { UserRoutes } from "../utils/userApi"

const AuthComponents = (): JSX.Element => {
  const { setUser, setAuth } = useAuth()
  const logout = useLogoutMutation({})

  function signOut() {
    setUser(null)
    setAuth(false)
    logout.mutate({})
  }
  return (
    <MenuItem onClick={signOut} margin={'0'}>
      Logout
    </MenuItem>
  )
}

export default AuthComponents