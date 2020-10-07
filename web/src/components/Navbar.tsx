// eslint-disable-next-line
import React from "react";

import NavItem from "./NavItem";
import { useAuth } from "./providers/AuthProvider";
import { usePlayerData } from "./providers/PlayerProvider";

const Navbar = () => {
  const { authenticated } = useAuth()!;
  const { toggleShowPlayers } = usePlayerData()!;

  const Left = () => (
    <>
      <h1 className="Title">
        {authenticated ? <NavItem route="/" name="Roll Me In" /> : "Roll Me In"}
      </h1>
      <div className="players-button" onClick={toggleShowPlayers}>Players</div>
    </>
  );

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
      <div className="Left">
        <Left />
      </div>

      <div className="Right">
        <Right />
      </div>
    </div>
  );
};

export default Navbar;
