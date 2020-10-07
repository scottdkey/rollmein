// eslint-disable-next-line
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

type ProtectedRouteType = {
  component: any;
  path: string;
};

const ProtectedRoute = ({ component: Component, path }: ProtectedRouteType) => {
  const { authenticated } = useAuth()!;

  if (!authenticated) {
    return <Redirect to={"/login"} />;
  } else {
    return <Route exact path={path} component={Component} />;
  }
};

export default ProtectedRoute;
