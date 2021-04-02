import { useAuth } from "./providers/AuthProvider";
import { usePlayerData } from "./providers/PlayerProvider";
import Drawer from "rsuite"
import "../styles/NavBar.scss"

const Navbar = () => {
  const { authenticated } = useAuth()!;
  const { toggleShowPlayers } = usePlayerData()!;

  const Left = () => (
    <div className="Left">
      <h2 className="title">RollMeIn</h2>

    </div>
  );
  const Center = () => (
    <div className="Center">
      <button onClick={toggleShowPlayers} className="Nav-Button">
        Players
      </button>
    </div>
  )

  const Right = () => {
    if (authenticated) {
      return (
        <div className="Right">
          <button className="Nav-Button">Logout</button>
        </div>
      );
    } else {
      return (
        <div className="Right">
          <button className="Nav-Button">Options</button>
          <button className="Nav-Button">Login</button>
        </div>
      );
    }
  };
  return (
    <div className="NavBar">
      <Left />
      <Center />
      <Right />
    </div>
  );
};

export default Navbar;