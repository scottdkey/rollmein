import { PlayerObject } from "./interfaces";

export const rollForRole = (role: string, players: Array<PlayerObject>) => {
  const group: Array<PlayerObject> = players.filter(
    (player) => player[role as keyof PlayerObject] === true
  );
  const locked = group.filter((p: PlayerObject) => p.locked === true);
  let pickedRole: PlayerObject;
  if (locked.length > 0) {
    pickedRole = randomFromArray(locked);
  } else {
    pickedRole = randomFromArray(group);
  }

  return pickedRole;
};

const randomFromArray = (players: Array<PlayerObject>) => {
  return players[Math.floor(Math.random() * players.length)];
};

const removePickFromGroup = (
  pickedPlayer: PlayerObject,
  remainingPlayers: Array<PlayerObject>
) => {
  const newRollGroup = remainingPlayers.filter(
    (player) => player.id !== pickedPlayer.id
  );
  return newRollGroup;
};
