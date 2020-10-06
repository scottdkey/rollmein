// eslint-disable-next-line
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import RenderPlayers from "./RenderPlayers";
import GroupRoll from "./GroupRoll";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./Logout";
import { useAuth } from "./providers/AuthProvider";
import Authenticate from "./Authenticate";
import NotFound from "./NotFound";

export default function ReactRouter() {
  const { authenticated } = useAuth()!;
  useEffect(() => {
    // checkStatus();
    // eslint-disable-next-line
  }, [authenticated]);
  return (
    <Switch>
      <ProtectedRoute path="/players" component={RenderPlayers} />
      <Route path="/login" component={Authenticate} />
      <ProtectedRoute path="/logout" component={Logout} />
      <ProtectedRoute path="/grouproll" component={GroupRoll} />
      <Route component={NotFound} />
    </Switch>
  );
}
