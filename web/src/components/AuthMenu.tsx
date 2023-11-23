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
      <div className={styles.Menu}>
        loading
      </div>
    )
  }

  return (
    <div className={styles.Menu}>
      <button className={styles.MenuButton}
        onClick={ToggleOpen}>
        <div className={styles.hStack}>
          <text>
            {status === 'authenticated' ? username : "Signed out"}
          </text>
          {loginOpen ?
            <div>chevronUpIcon</div> : <div>chevronDownIcon</div>}
        </div>

      </button>
      <div className={styles.MenuList}>
        {status === "authenticated" ?
          <AuthNav /> : <UnAuthNav />}
      </div>
    </div>
  )
}

export default AuthMenu


