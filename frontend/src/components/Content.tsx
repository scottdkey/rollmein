import { Route, Switch } from "react-router-dom";

import NotFound from "./NotFound";

export default function ReactRouter() {

  return (
      <Switch>
        <Route component={NotFound} />
      </Switch>
  );
}
