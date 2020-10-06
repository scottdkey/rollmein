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
    CheckStatus()
      .then((res) => updateAuth(res))
      .catch((err) => {
        if (err.status === 401) {
          setError("Not Authorized");
        }
      });
  };
  const logout = () => {
    Logout()
      .then((res) => updateAuth(res))
      .catch((err) => console.log(err.status));
    setAuthenticated(false);
  };
  const register = async (user: AuthObject) => {
    Register(user)
      .then((res) => updateAuth(res))
      .catch((err) => console.log(err));
  };
  const appleLogin = () => {};
  const googleLogin = () => {};
  const updateUser = (updatedUser: UserObject) => {
    Update(updatedUser)
      .then((res) => updateAuth(res))
      .catch((err) => console.log(err));
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
