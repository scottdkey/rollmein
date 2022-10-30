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
}

interface UserData {
  id: string;
  username: string | null;
}


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const { data, isLoading, error } = useMeQuery()
  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (data) {
      setUser(data)
      setAuth(true)
    }
    if (error) {
      setUser(null)
      setAuth(false)
    }

  }, [data, error, isLoading])

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

