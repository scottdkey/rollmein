
import { BrowserRouter as Router } from "react-router-dom";
import Content from "./components/Content";
import Navbar from "./components/Navbar";

function App() {

  return (

    <div className="app">
      <Router >
        <Navbar />
        <Content />
      </Router>
    </div>
  );
}

export default App;
