// eslint-disable-next-line
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./components/providers/AuthProvider";
import { PlayerProvider } from "./components/providers/PlayerProvider";
import { ThemeProvider } from "./components/providers/ThemeProvider";

import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Router>
          <AuthProvider>
            <PlayerProvider>
              <Navbar />
              <Content />
              <Footer />
            </PlayerProvider>
          </AuthProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
