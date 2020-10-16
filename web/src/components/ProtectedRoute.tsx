// eslint-disable-next-line
import React from "react";
import { Route, Redirect } from "react-router-dom";

import { ProtectedRouteType } from "../types/Types";
import { useAuth } from "./providers/AuthProvider";

const ProtectedRoute = ({ component: Component, path }: ProtectedRouteType) => {
  const { authenticated } = useAuth()!;

  if (!authenticated) {
    return <Redirect to={"/login"} />;
  } else {
    return <Route exact path={path} component={Component} />;
  }
};

export default ProtectedRoute;
