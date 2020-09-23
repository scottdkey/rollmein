// eslint-disable-next-line
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

type ProtectedRouteType = {
  component: any;
  path: string;
};

const ProtectedRoute = ({ component: Component, path }: ProtectedRouteType) => {
  const { authenticated } = useAuth()!;
  // const authenticated = true;

  if (authenticated) {
    return <Route path={path} component={Component} />;
  } else {
    return <Redirect to={{ pathname: "/login" }} />;
  }
};

export default ProtectedRoute;
