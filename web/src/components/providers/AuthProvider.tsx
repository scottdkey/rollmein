import React, { createContext, useState, useContext } from "react";
import { UserObject } from "./interfaces";
const UserContext = createContext(null);

const UserInfo = () => {
  const user: UserObject | null = useContext(UserContext);

  return <div>{user ? `Logged in as ${user!.username}` : "Anonymous"}</div>;
};

export default UserInfo