// eslint-disable-next-line
import React from "react";
import { PlayerProvider } from "./components/providers/PlayerProvider";
import { AuthProvider } from "./components/providers/AuthProvider";
import Navbar from "./components/Navbar";
import ReactRouterRoutes from "./components/providers/React-Router-Routes";
import { BrowserRouter as Router } from "react-router-dom";


function App() {

  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <PlayerProvider>
            <Navbar />
            <ReactRouterRoutes />
          </PlayerProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
