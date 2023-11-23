
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react"

const AuthComponents = (): JSX.Element => {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }
  return (
    <button onClick={handleSignOut} >
      Logout
    </button>
  )
}

export default AuthComponents