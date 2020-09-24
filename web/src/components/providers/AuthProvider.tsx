// eslint-disable-next-line
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserObject, AuthObject } from "../utils/Interfaces";
import axios from "axios";

type AuthContextType = {
  login: (value: AuthObject) => void;
  logout(): any;
  register: (value: AuthObject) => void;
  checkStatus: () => void;
  appleLogin: (value: Object) => void;
  googleLogin: (value: Object) => void;
  updateUser: (value: Object) => void;
  deleteUser: (value: Object) => void;
  user: UserObject | undefined;
  authenticated: boolean;
};

type AuthReturn = {
  user: UserObject;
  success: boolean;
};

const UserContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserObject | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  function updateStatus(data: AuthReturn) {
    setUser(data.user);
    setAuthenticated(data.success);
  }

  const login = async (authObject: AuthObject | undefined) => {
    checkStatus();
    const res = await axios.post("/login", authObject);
    try {
      updateStatus(res.data);
    } catch (error) {
      console.log(error);
      updateStatus(res.data);
    }
  };

  const checkStatus = async () => {
    const res = await axios.get("/status");
    try {
      updateStatus(res.data);
    } catch (error) {
      console.log(error);
      updateStatus(res.data);
    }
  };
  const logout = async () => {
    const res = await axios.get("/logout", { withCredentials: true });
    if (res.status === 200) {
      updateStatus(res.data);
    } else {
      console.log("error, loggout didn't work");
    }
  };
  const register = async (user: AuthObject) => {
    const res = await axios.post("/register", user);
    if (res.status === 200) {
      updateStatus(res.data);
    } else {
      console.log(res);
    }
  };
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
