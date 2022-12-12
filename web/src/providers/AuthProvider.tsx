// eslint-disable-next-line
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMeQuery } from "../utils/userApi";


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
  loading: boolean
  setLoading: (value: boolean) => void;
}

interface UserData {
  id: string;
  username: string | null;
}


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const meQuery = useMeQuery()
  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(meQuery.isLoading)
    if (meQuery.data?.user && !meQuery.isLoading) {
      setUser(meQuery.data.user)
      setAuth(true)
    }
    if (meQuery.error) {
      setUser(null)
      setAuth(false)
    }

  }, [meQuery.data, meQuery.error, meQuery.isLoading])

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser, loading, setLoading } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

