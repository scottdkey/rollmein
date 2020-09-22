import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import RenderPlayers from "../RenderPlayers";
import GroupRoll from "../GroupRoll";
import ProtectedRoute from "../ProtectedRoute"

export default function ReactRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" />
      <Route path="/logout" />
      <ProtectedRoute path="/players" component={RenderPlayers} />
      <Route path="/" component={GroupRoll} />
      <Route path="/friends" component={GroupRoll} />
    </Switch>
  );
}
