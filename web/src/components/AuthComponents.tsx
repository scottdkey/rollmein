import { MenuItem } from "@chakra-ui/react"
import { useAuth } from "../providers/AuthProvider"
import { deleteCookie } from "../utils/cookieHelpers"
import { supabase } from "../utils/supabase.client"

const AuthComponents = (): JSX.Element => {


  return (
    <MenuItem onClick={() => { supabase.auth.signOut() }} margin={'0'}>
      Logout
    </MenuItem>
  )
}

export default AuthComponents