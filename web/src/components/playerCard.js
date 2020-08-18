import React, { useState, useEffect } from "react";
import PlayerFormModal from "./playerFormModal";
import { images } from "./providers/images";
import { roleLogo } from "./providers/imageStyles";

const PlayerCard = ({ player, removePlayer, updatePlayer }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [tank, setTank] = useState(player.tank);

  const [dps, setDps] = useState(player.dps);
  const [healer, setHealer] = useState(player.healer);

  const handleLocked = () => {
    const p = { ...player, locked: !player.locked };
    updatePlayer(p);
  };

  const handleIn = () => {
    const p = { ...player, in: !player.in };
    updatePlayer(p);
  };

  const updateRoles = (roleToUpdate, newBoolean) => {
    const updatedPlayer = { ...player };
    updatedPlayer[roleToUpdate] = newBoolean;
    console.log(updatedPlayer);
    updatePlayer(updatedPlayer);
  };

  useEffect(() => {}, [player]);
  return (
    <div>
      <div> Name: {player.name}</div>
      <label>Locked?</label>
      <input type="checkbox" checked={player.locked} onChange={handleLocked} />
      <label>In the Roll?</label>
      <input type="checkbox" checked={player.in} onChange={handleIn} />
      <div>
        <img
          style={roleLogo}
          src={player.tank ? images.tank : images.tankUnselected}
          alt="tank logo"
          onClick={() => {
            setTank(!tank);
            updateRoles("tank", !tank);
          }}
        />
        <img
          style={roleLogo}
          src={healer ? images.healer : images.healerUnselected}
          alt="healer logo"
          onClick={() => {
            setHealer(!healer);
            updateRoles("healer", !healer);
          }}
        />
        <img
          style={roleLogo}
          src={dps ? images.dps : images.dpsUnselected}
          alt="dps logo"
          onClick={() => {
            setDps(!dps);
            updateRoles("dps", !dps);
          }}
        />
      </div>
      <button onClick={() => setModalOpen(true)}> Edit</button>

      <PlayerFormModal
        player={player}
        visible={modalOpen}
        close={() => setModalOpen(false)}
        updatePlayer={updatePlayer}
        removePlayer={removePlayer}
      />
    </div>
  );
};

export default PlayerCard;
