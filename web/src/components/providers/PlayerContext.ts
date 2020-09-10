import { createContext } from "react";
import { playersPlaceHolder } from "./databasePlaceholder";

const PlayerContext = createContext(playersPlaceHolder);

export default PlayerContext;
