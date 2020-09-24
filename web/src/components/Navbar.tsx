// eslint-disable-next-line
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

type NavType = {
  name: string;
  route: string;
};

const leftNav: Array<NavType> = [
  // { name: "Friends", route: "/friends" },
  { name: "Test", route: "/" },
  { name: "Players", route: "/players" },
];
const authedRight: Array<NavType> = [
  { name: "logout", route: "/logout" },
  { name: "profile", route: "/profile" },
];
const notAuthedRight: Array<NavType> = [
  { name: "login", route: "/login" },
  { name: "register", route: "/register" },
];

type NavSectionType = {
  className: string;
  NavArray: Array<NavType>;
  children?: any;
};

const Navbar = () => {
  const { authenticated } = useAuth()!;

  const isActive = (routeToMatch: string) => {
    if (window.location.pathname === `${routeToMatch}`) {
      return true;
    } else {
      return false;
    }
  };

  const NavItem = ({ item }: { item: NavType }) => (
    <NavLink
      exact
      to={item.route}
      isActive={() => isActive(item.route)}
      className="li Nav-Item"
      activeClassName="li Nav-Item-Active"
    >
      {item.name}
    </NavLink>
  );

  const NavSection = ({ className, NavArray }: NavSectionType) => (
    <div className={`ul ${className}`}>
      {NavArray.map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </div>
  );

  return (
    <>
      <div className="Nav-Bar">
        <h1 className="Nav-Header">Roll Me in</h1>
        <NavSection className="Left" NavArray={leftNav} />
        {authenticated ? (
          <NavSection className="Right" NavArray={authedRight} />
        ) : (
          <NavSection className="Right" NavArray={notAuthedRight} />
        )}
      </div>
    </>
  );
};

export default Navbar;
