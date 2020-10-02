// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";

type ProtectedRouteType = {
  component: any;
  path: string;
};

const ProtectedRoute = ({ component: Component, path }: ProtectedRouteType) => {
  const [loading, setLoading] = useState(false);
  const { authenticated } = useAuth()!;

  useEffect(() => {
    if (authenticated) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authenticated]);

  if (loading) {
    return <p>Loading</p>;
  } else if (!authenticated) {
    return <Redirect to={"/login"} />;
  } else {
    return <Route path={path} component={Component} />;
  }
};

export default ProtectedRoute;