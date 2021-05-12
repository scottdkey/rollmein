// eslint-disable-next-line
import React, { useState, useEffect } from "react";

import { ReactComponent as ClosedLock } from "./assets/svgs/Lock.svg";
import { ReactComponent as OpenLock } from "./assets/svgs/OpenLock.svg";
import { ReactComponent as Dice } from "./assets/svgs/Dice.svg";
import { ReactComponent as Trash } from "./assets/svgs/Trash.svg";
import Tank from "./assets/images/TANK.png";
import Dps from "./assets/images/DPS.png";
import Healer from "./assets/images/HEALER.png";
import { PlayerObject, PlayerFormObject } from "../types/Interfaces";
import { usePlayerData } from "./providers/PlayerProvider";
import RoleLogoImage from "./RoleLogoImage";
import { useAuth } from "./providers/AuthProvider";
import { GetOnePlayer } from "./utils/PlayerCRUD";

type PlayerCardType = {
  cardId?: number;
};

const PlayerCard = ({ cardId }: PlayerCardType) => {
  const {
    updatePlayer,
    removePlayer,
    addPlayer,
    blankPlayer,
  } = usePlayerData()!;
  const { uuid } = useAuth()!;
  const [playerName, setPlayerName] = useState("");
  const [tank, setTank] = useState(false);
  const [dps, setDps] = useState(false);
  const [healer, setHealer] = useState(false);
  const [locked, setLocked] = useState(false);
  const [inTheRoll, setInTheRoll] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(false);

  const handleSubmit = async (e: any) => {
    console.log("handle submit hit");
    e.preventDefault();
    const conformedPlayer: PlayerFormObject = {
      playerName,
      tank,
      dps,
      healer,
      locked,
      inTheRoll,
      userId: uuid!,
    };
    const res = await addPlayer(conformedPlayer);
    updateAllValues(res);
    toggleForm();
    clearForm();
  };

  function clearForm() {
    updateAllValues(blankPlayer);
  }

  function toggleForm() {
    setEditOrCreate(!editOrCreate);
  }

  const updateAllValues = (playerObject: PlayerFormObject) => {
    setPlayerName(playerObject.playerName);
    setTank(playerObject.tank);
    setDps(playerObject.dps);
    setHealer(playerObject.healer);
    setLocked(playerObject.locked);
    setInTheRoll(playerObject.inTheRoll);
  };

  const handleBooleanUpdate = async (
    type: string,
    booleanToChange: boolean,
    callBack: Function
  ) => {
    callBack(!booleanToChange);
    const idCheck = cardId!;
    const conformedPlayer: PlayerObject = {
      id: idCheck,
      playerName,
      tank,
      dps,
      healer,
      locked,
      inTheRoll,
      userId: uuid!,
    };
    const updatedPlayer = { ...conformedPlayer, [type]: !booleanToChange };
    const res = await updatePlayer(updatedPlayer);
    updateAllValues(res);
  };


  useEffect(() => {
    const getPlayerFromDatabase = async () => {
      const res = await GetOnePlayer(cardId!);
      updateAllValues(res);
    };
    if (cardId) {
      getPlayerFromDatabase();
    } else {
      setEditOrCreate(false);
      updateAllValues(blankPlayer);
    }
  }, [blankPlayer, cardId]);

  function AddPlayerArea() {
    return (
      <div
        className="add-player"
        onClick={toggleForm}
        style={{ height: "150px" }}
      >
        <div className="add-player-button">Add Player</div>
      </div>
    );
  }

  const TrashButton = () => {
    if (cardId) {
      return (
        <Trash
          className="image delete-icon"
          onClick={() => removePlayer(cardId)}
        />
      );
    } else {
      return null;
    }
  };
  const CurrentCardHead = () => (
    <div className="card-head">
      <div className="name">{playerName}</div>
      <TrashButton />
    </div>
  );
  if (cardId === undefined && !editOrCreate) {
    return <AddPlayerArea />;
  } else {
    return (
      <div className={locked ? "card-locked" : "card"}>
        <div
          className="card-locked-area"
          onClick={() => {
            handleBooleanUpdate("locked", locked, setLocked);
          }}
        >
          {locked ? (
            <ClosedLock className="image locked" />
          ) : (
            <OpenLock className="image unlocked" />
          )}
        </div>

        <div className="card-head">
          {editOrCreate ? (
            <form>
              <label>
                Player Name
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <button onClick={handleSubmit}>Save</button>
                <button onClick={() => toggleForm()}>Cancel</button>
              </label>
            </form>
          ) : (
            <CurrentCardHead />
          )}
        </div>
        <div className="card-body">
          <RoleLogoImage
            active={tank}
            source={Tank}
            type="tank"
            onClick={() => handleBooleanUpdate("tank", tank, setTank)}
          />
          <RoleLogoImage
            active={healer}
            source={Healer}
            type="healer"
            onClick={() => handleBooleanUpdate("healer", healer, setHealer)}
          />
          <RoleLogoImage
            active={dps}
            source={Dps}
            type="dps"
            onClick={() => handleBooleanUpdate("dps", dps, setDps)}
          />

          <Dice
            className={`image ${inTheRoll ? "in-the-roll-active" : "in-the-roll"
              }`}
            onClick={() =>
              handleBooleanUpdate("inTheRoll", inTheRoll, setInTheRoll)
            }
          />
        </div>
      </div>
    );
  }
};

export default PlayerCard;
