// eslint-disable-next-line
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import RenderPlayers from "./RenderPlayers";
import GroupRoll from "./GroupRoll";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./Logout";
import { useAuth } from "./providers/AuthProvider";
import Authenticate from "./Authenticate";

export default function ReactRouter() {
  const { authenticated, checkStatus } = useAuth()!;
  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line
  }, [authenticated]);
  return (
    <Switch>
      <Route path="/login" component={() => <Authenticate type="login" />} />
      <Route
        path="/register"
        component={() => <Authenticate type="register" />}
      />
      <ProtectedRoute path="/profile" component={GroupRoll} />
      <Route path="/logout" component={Logout} />
      <ProtectedRoute path="/players" component={RenderPlayers} />
      <Route exact-path="/" component={GroupRoll} />
      <Route path="/friends" component={GroupRoll} />
    </Switch>
  );
}
