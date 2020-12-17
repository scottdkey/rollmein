// eslint-disable-next-line
import React, { createContext, useState, useContext, useEffect } from "react";
import { Redirect } from "react-router";
import {
  Login,
  CheckStatus,
  Logout,
  Register,
  Update,
} from "../utils/AuthCRUD";
import { UserObject, AuthObject } from "../../types/Interfaces";
import { AuthReturn, AuthContextType } from "../../types/Types";

const UserContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: any) => {
  const [user_id, setUser_id] = useState<string | undefined>();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function updateAuth(res: AuthReturn) {
    setUser_id(res.data);
  }

  const login = (authObject: AuthObject) => {
    Login(authObject!)
      .then((res) => {
        updateAuth(res);
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          console.log(res, "unable to autheticate")
          setAuthenticated(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const checkStatus = () => {
    CheckStatus()
      .then((res) => {
        updateAuth(res);
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          setError("Unauthorized");
        }
      });
  };
  const logout = () => {
    Logout()
      .then((res) => {
        updateAuth(res);
        setAuthenticated(false);
      })
      .catch((err) => console.log(err.status));
    setAuthenticated(false);
    return <Redirect to="login" />;
  };
  const register = async (user: AuthObject) => {
    Register(user)
      .then((res) => {
        updateAuth(res);
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
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

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line
  }, [authenticated]);

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
        user_id,
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
