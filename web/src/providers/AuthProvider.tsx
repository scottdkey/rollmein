// eslint-disable-next-line
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMeQuery, useOptionsQuery } from "../generated/graphql"
import { client } from "../lib/clients/graphqlRequestClient";

export type OptionsType = {
  rollType: string
  theme: string
  lockAfterOut: boolean

}


export type AuthContextType = {
  auth: boolean
  options: OptionsType
  setAuth: (value: boolean) => void;
  setOptions: (value: OptionsType) => void;
}



export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const meQuery = useMeQuery(client)
  const optionsQuery = useOptionsQuery(client)
  const [auth, setAuth] = useState<boolean>(meQuery.data !== undefined)
  const [options, setOptions] = useState<OptionsType>(optionsQuery.data?.options ? {
    rollType: optionsQuery.data.options?.rollType,
    theme: optionsQuery.data.options?.theme,
    lockAfterOut: optionsQuery.data.options?.lockAfterOut

  } : {
    rollType: "ffa",
    theme: "dark",
    lockAfterOut: false
  }
  )



  return (
    <AuthContext.Provider value={{ auth, options, setAuth, setOptions } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

