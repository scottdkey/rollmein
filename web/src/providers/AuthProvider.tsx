// eslint-disable-next-line
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMeQuery, useOptionsQuery } from "../generated/graphql"
import { getCookie } from "../utils/cookieHelpers";
import { GraphQLClient } from "graphql-request"
import { graphqlEndpoint, isServer } from "../utils/constants"
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
}



export const AuthContext = createContext<AuthContextType>({} as AuthContextType);



export const AuthProvider = ({ children }: any) => {

  const [auth, setAuth] = useState<boolean>(false)
  const [options, setOptions] = useState<OptionsType>({
    rollType: "ffa",
    theme: "dark",
    lockAfterOut: false
  })




  return (
    <AuthContext.Provider value={{ auth, options, setAuth, setOptions } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

