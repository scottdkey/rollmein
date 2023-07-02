'use client'
import { useEffect } from "react"
import { supabaseBrowser } from "../../libs/supabase.browser"
import { useAuthState } from "../../stores/auth.store"


export default function AuthMenu() {
  const supabase = supabaseBrowser()
  const session = useAuthState(state => state.session)
  const getSession = useAuthState(state => state.get)

  useEffect(() => {
    console.log(session)
    if (!session) {
      getSession().then(data => {
        console.log(data)
      })
    }
  }, [session])



  return (
    <>
      <div>
        {session ? JSON.stringify(session, null, 2) : 'signed out'}
      </div>
      <button onClick={() => {
        supabaseBrowser().auth.signInWithOAuth({
          provider: 'google'
        })
      }} hidden={session === null}>sign in</button>
      <button className="btn btn-blue" onClick={() => {
        supabaseBrowser().auth.signOut()
      }} hidden={session !== null}>sign out</button>
    </>
  )
}