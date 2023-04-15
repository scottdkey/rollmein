import { MenuItem } from "@chakra-ui/react"
import { useRouter } from 'next/router';
import {signOut} from "next-auth/react"

const AuthComponents = (): JSX.Element => {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }
  return (
    <MenuItem onClick={handleSignOut} margin={'0'}>
      Logout
    </MenuItem>
  )
}

export default AuthComponents