// eslint-disable-next-line
import React, { createContext, useState, useContext } from "react";
import {
  Login,
  CheckStatus,
  Logout,
  Register,
  Update,
} from "../utils/AuthCRUD";
import { UserObject, AuthObject } from "../utils/Interfaces";
import { AuthReturn, AuthContextType } from "../utils/Types";

const UserContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserObject | undefined>(undefined);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function updateAuth(res: AuthReturn) {
    setUser(res.data);
    setAuthenticated(res.status === 200);
  }

  const login = (authObject: AuthObject) => {
    checkStatus();
    Login(authObject!, updateAuth);
  };

  const checkStatus = () => {
    CheckStatus(updateAuth, setError);
  };
  const logout = () => {
    Logout(updateAuth);
  };
  const register = async (user: AuthObject) => {
    Register(user, updateAuth);
  };
  const appleLogin = () => {};
  const googleLogin = () => {};
  const updateUser = (updatedUser: UserObject) => {
    Update(updatedUser, updateAuth);
  };
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
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuth = () => useContext(UserContext);

export { AuthProvider, useAuth };
