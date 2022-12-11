import { MenuItem } from "@chakra-ui/react"
import { useAuth } from "../providers/AuthProvider"
import { useLogoutMutation } from "../utils/authApi"
import { useRouter } from 'next/router';

const AuthComponents = (): JSX.Element => {
  const { setUser, setAuth } = useAuth()
  const logout = useLogoutMutation({})
  const router = useRouter()

  function signOut() {
    setUser(null)
    setAuth(false)
    logout.mutate({})
    router.push('/')
  }
  return (
    <MenuItem onClick={signOut} margin={'0'}>
      Logout
    </MenuItem>
  )
}

export default AuthComponents