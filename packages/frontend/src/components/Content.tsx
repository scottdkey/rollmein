// eslint-disable-next-line
import React from "react";
import { Route, Switch } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";

export default function ReactRouter() {

  return (
    <div className="content">
      <Switch>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
