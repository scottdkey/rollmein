// eslint-disable-next-line
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase.client"


export type OptionsType = {
  rollType: string
  theme: string
  lockAfterOut: boolean

}
export type HeaderOptions = {
  headers: {
    authorization: string
  }
}


export type AuthContextType = {
  auth: boolean
  setAuth: (value: boolean) => void;
  user?: UserData
  setUser: (value: React.SetStateAction<UserData | null>) => void;
}

interface UserData {
  id: string;
  email: string | null;
  username: string | null;
  anon: boolean;
  refreshToken: string;
  providerId: string;
  providerData: ({} | null)[];
}


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)

  const userRes = supabase.auth.user()

  supabase.auth.onAuthStateChange((e, session) => {
    switch (e) {
      case 'SIGNED_IN':
        setUser(supabase.auth.user())
        setAuth(true)
        break
      case 'SIGNED_OUT':
        setUser(null)
        setAuth(false)
        break
      case 'TOKEN_REFRESHED':
        console.log(session)
        break
      default:
        console.error('other unhandled event:', e)
    }
  })


  useEffect(() => {
    console.log(userRes)
    if (userRes) {
      setUser(userRes)
      setAuth(true)
    }
  }, [userRes])



  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

