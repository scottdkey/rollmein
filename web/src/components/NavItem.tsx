// eslint-disable-next-line
import React from "react";
import { NavLink } from "react-router-dom";
import { NavItemType } from "./utils/Types";

import { isActive } from "./utils/Navbar";

const NavItem = ({ route, name }: NavItemType) => {
  return (
    <NavLink
      exact
      to={route}
      isActive={() => isActive(route)}
      className="li Nav-Item"
      activeClassName="li Nav-Item-Active"
    >
      {name}
    </NavLink>
  );
};

export default NavItem;
