// eslint-disable-next-line
import { AppBar, Toolbar, Typography, Button, IconButton } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import { useAuth } from "./providers/AuthProvider";
import { usePlayerData } from "./providers/PlayerProvider";

const Navbar = () => {
  const { authenticated } = useAuth()!;
  const { toggleShowPlayers } = usePlayerData()!;

  const Left = () => (
    <>
      <h1 className="Title">
        {authenticated ? "Roll Me In" : "Roll Me In"}
      </h1>
      <div className="players-button" onClick={toggleShowPlayers}>
        Players
      </div>
    </>
  );

  const Right = () => {
    if (authenticated) {
      return (
        <>
        </>
      );
    } else {
      return (
        <>
        </>
      );
    }
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">RollMeIn</Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
