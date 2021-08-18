// eslint-disable-next-line
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMeQuery, useOptionsQuery } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient"

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
  options: OptionsType
  setAuth: (value: boolean) => void;
  setOptions: (value: OptionsType) => void;
  user?: User
}



export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type User = {
  id: string,
  username: string
}

export const AuthProvider = ({ children }: any) => {
  const { data, isLoading } = useMeQuery(client)
  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<User>()
  useEffect(() => {
    if (!isLoading && data?.me) {
      setAuth(true)
      setUser(data.me)
    }
  }, [isLoading])



  return (
    <AuthContext.Provider value={{ auth, setAuth, user } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

