// eslint-disable-next-line
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserObject, AuthObject } from "../utils/Interfaces";
import axios from "axios";

type AuthContextType = {
  login: (value: AuthObject) => void;
  logout(): any;
  register: (value: Object) => void;
  checkStatus: () => void;
  appleLogin: (value: Object) => void;
  googleLogin: (value: Object) => void;
  updateUser: (value: Object) => void;
  deleteUser: (value: Object) => void;
  user: UserObject | undefined;
  authenticated: boolean;
};

const UserContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserObject | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const login = async (authObject: AuthObject | undefined) => {
    await axios.post("/login", authObject);
    await checkStatus();
  };

  const checkStatus = async () => {
    const res = await axios.get("/status");
    try {
      setUser(res.data.user);
      setAuthenticated(res.data.success);
    } catch (error) {
      setUser(undefined);
      setAuthenticated(res.data.success);
    }
  };
  const logout = async () => {
    const res = await axios.get("/logout", { withCredentials: true });
    if (res.status === 200) {
      setUser(undefined);
      setAuthenticated(false);
    } else {
      console.log("error, loggout didn't work");
    }
  };
  const register = () => {};
  const appleLogin = () => {};
  const googleLogin = () => {};
  const updateUser = () => {};
  const deleteUser = () => {};

  return (
    <UserContext.Provider
      value={{
        login,
        logout,
        register,
        appleLogin,
        googleLogin,
        updateUser,
        deleteUser,
        checkStatus,
        user,
        authenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => useContext(UserContext);

export { AuthProvider, useAuth };
