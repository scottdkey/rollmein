// eslint-disable-next-line
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import RenderPlayers from "../RenderPlayers";
import GroupRoll from "../GroupRoll";
import ProtectedRoute from "../ProtectedRoute";
import Logout from "../Logout";
import { useAuth } from "./AuthProvider";

export default function ReactRouter(props: any) {
  const { authenticated, checkStatus } = useAuth()!;
  useEffect(() => {
    checkStatus();
  }, [authenticated, checkStatus]);
  return (
    <Router>
      {props.children}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" />
        <Route path="/logout" component={Logout} />
        <ProtectedRoute path="/players" component={RenderPlayers} />
        <Route path="/" component={GroupRoll} />
        <Route path="/friends" component={GroupRoll} />
      </Switch>
    </Router>
  );
}
