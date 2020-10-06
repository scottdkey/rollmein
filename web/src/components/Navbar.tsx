// eslint-disable-next-line
import React from "react";

import NavItem from "./NavItem";
import { useAuth } from "./providers/AuthProvider";

const Navbar = () => {
  const { authenticated } = useAuth()!;

  const Left = () => {
    if (authenticated) {
      return (
        <>
          <NavItem route="/players" name="Players" />
          <NavItem route="/grouproll" name="Roll" />
        </>
      );
    } else {
      return <></>;
    }
  };

  const Right = () => {
    if (authenticated) {
      return (
        <>
          <NavItem route="/options" name="Options" />
          <NavItem route="/logout" name="Logout" />
        </>
      );
    } else {
      return (
        <>
          <NavItem route="/login" name="Login" />
        </>
      );
    }
  };

  return (
    <div className="Nav-Bar">
      <h1 className="Nav-Header">Roll Me in</h1>
      <Left />
      <Right />
    </div>
  );
};

export default Navbar;
