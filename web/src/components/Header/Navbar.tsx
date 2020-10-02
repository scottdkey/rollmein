// eslint-disable-next-line
import React from "react";

import NavItem from "./NavItem";
import { useAuth } from "../providers/AuthProvider";

type NavType = {
  name: string;
  route: string;
};

const leftNav: Array<NavType> = [
  // { name: "Friends", route: "/friends" },
  { name: "Home", route: "/" },
  { name: "Players", route: "/players" },
  { name: "Roll", route: "/grouproll" },
];
const authedRight: Array<NavType> = [
  { name: "logout", route: "/logout" },
  { name: "profile", route: "/profile" },
];
const notAuthedRight: Array<NavType> = [
  { name: "login", route: "/login" },
  { name: "register", route: "/register" },
];

const Navbar = () => {
  const { authenticated } = useAuth()!;

  const AuthedRight = () => {
    return (
      <>
        <NavItem route="/logout" name="Logout" />
      </>
    );
  };
  const NotAuthedRight = () => {
    return (
      <>
        <NavItem route="/logout" name="Logout" />
      </>
    );
  };

  return (
    <>
      <div className="Nav-Bar">
        <h1 className="Nav-Header">Roll Me in</h1>
        {authenticated ? AuthedRight() : NotAuthedRight()}
      </div>
    </>
  );
};

export default Navbar;
