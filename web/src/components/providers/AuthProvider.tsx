import React, { createContext, useState, useContext } from "react";
import { UserObject, AuthObject } from "../utils/Interfaces";
import axios from "axios";

type AuthContextType = {
  login: (value: AuthObject) => void;
  logout(): any;
  register: (value: Object) => void;
  checkStatus: (value: Object) => void;
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

  const login = async (authObject: AuthObject) => {
    const res = await axios.post("/login", authObject);
    if (res.data.id) {
      setUser(res.data);
      setAuthenticated(true);
    } else {
      setUser(undefined);
      setAuthenticated(false);
      console.log(res);
    }
  };

  const checkStatus = async () => {
    const res = await axios.get("/auth/status");

    console.log(res);
  };
  const logout = () => {};
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
