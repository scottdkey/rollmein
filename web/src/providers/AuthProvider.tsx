// eslint-disable-next-line
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "../utils/constants";
import { supabase } from "../utils/supabase.client"
import { apiValidateSignIn } from "../utils/authApi";


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



  return (
    <AuthContext.Provider value={{ auth, setAuth, user, setUser } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext);

