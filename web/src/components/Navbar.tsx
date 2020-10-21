// eslint-disable-next-line
import React from "react";

import Options from "./Options";
import ValidGroup from "./ValidGroup";
import NavItem from "./NavItem";
import { Link } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import { usePlayerData } from "./providers/PlayerProvider";

const Navbar = () => {
  const { authenticated } = useAuth()!;
  const { showPlayers, toggleShowPlayers } = usePlayerData()!;

  const Left = () => {
    if (authenticated) {
      return (
        <div className="Left">
          <h1 className="Title">
            <Link to="/">Roll Me In</Link>
          </h1>
        </div>
      );
    } else {
      return (
        <div className="Left">
          <h1 className="Title">Roll Me In</h1>
        </div>
      );
    }
  };

  const Right = () => {
    if (authenticated) {
      return (
        <div className="Right">
          <NavItem route="/logout" name="Logout" />
        </div>
      );
    } else {
      return (
        <div className="Right">
          <NavItem route="/login" name="Login" />
        </div>
      );
    }
  };

  const Center = () => {
    return (
      <div className="Center">
        <ValidGroup />
        <Options />
        <div
          className={showPlayers ? "players-button-active" : "players-button"}
          onClick={toggleShowPlayers}
        >
          Players
        </div>
      </div>
    );
  };
  return (
    <div className="Nav-Bar">
      <Left />
      <Center />
      <Right />
    </div>
  );
};

export default Navbar;
