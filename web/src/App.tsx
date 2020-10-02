// eslint-disable-next-line
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./components/providers/AuthProvider";
import { PlayerProvider } from "./components/providers/PlayerProvider";

import Content from "./components/Content";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <PlayerProvider>
            <Header />
            <Content />
            <Footer />
          </PlayerProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
