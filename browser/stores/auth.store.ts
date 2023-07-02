import { create } from 'zustand'
import { supabaseBrowser } from '../libs/supabase.browser'
import { AuthError, Session } from '@supabase/supabase-js'


interface AuthState {
  session: Session | null
  error: AuthError | null
  userId: string | null
  get: () => Promise<Session | null>
  set: () => Promise<Session | null>
}

export const useAuthState = create<AuthState>()((set) => {
  const supabase = supabaseBrowser()
  return ({
    session: null,
    error: null,
    userId: null,
    get: async () => {
      const session = await supabase.auth.getSession()
      const sessionData = session.data
      const sessionError = session.error
      const userId = sessionData.session?.user.id ?? null
      set({
        session: sessionData.session,
        error: sessionError,
        userId
      })
      return session.data.session
    },
    set: async() => {
      return null
    }
  })
})