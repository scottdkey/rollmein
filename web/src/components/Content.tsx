// eslint-disable-next-line
import React from "react";
import { Route, Switch } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Logout from "./Logout";

import Login from "./Login";
import NotFound from "./NotFound";
import Index from ".";

export default function ReactRouter() {
  return (
    <div className="content">
      <Switch>
        <ProtectedRoute path="/logout" component={Logout} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/" component={Index} />
        <Route path="/options" />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
