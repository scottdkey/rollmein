import { PlayerObject, DPSObject } from "./interfaces";

const rollForRole = (role: string, players: Array<PlayerObject>): PlayerObject => {
  const group: Array<PlayerObject> = players.filter(
    (player) => player[role as keyof PlayerObject] === true
  );
  return rollWithLocked(group)
};

const rollWithLocked = (players: Array<PlayerObject>) => {
  const locked = players.filter((p: PlayerObject) => p.locked === true);
  const outGroup = players.filter((p: PlayerObject) => p.locked === false)
  let pickedPlayer: PlayerObject;
  if (locked.length > 0) {
    pickedPlayer = randomFromArray(locked);
  } else {
    pickedPlayer = randomFromArray(outGroup);
  }
  return pickedPlayer
}

const randomFromArray = (players: Array<PlayerObject>) => {
  return players[Math.floor(Math.random() * players.length)];
};

const removeFromGroup = (
  pickedPlayer: PlayerObject,
  remainingPlayers: Array<PlayerObject>
) => {
  const newRollGroup = remainingPlayers.filter(
    (player) => player.id !== pickedPlayer.id
  );
  return newRollGroup;
};
export const FFARoll = async (currentGroup: Array<PlayerObject>) => {
  let remaining = currentGroup
  let players: Array<PlayerObject> = []
  for (let i = 1; i <= 5; i++) {
    const pickedPlayer = await rollWithLocked(remaining)
    players.push(pickedPlayer)
    remaining = await removeFromGroup(pickedPlayer, remaining)
  }
  return { players, remaining }
}

export const rollByRole = (arrayOfPlayers: Array<PlayerObject>) => {
  let remaining = arrayOfPlayers;
  const t: PlayerObject = rollForRole("tank", remaining);
  remaining = removeFromGroup(t, remaining);
  const h: PlayerObject = rollForRole("healer", remaining);
  remaining = removeFromGroup(h, remaining);
  const d: DPSObject = rollForDps(remaining);
  return { t, h, d };
};

const rollForDps = (currentGroup: Array<PlayerObject>) => {
  let remaining = currentGroup;

  const newDPS: Array<PlayerObject> = [];
  for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
    const pickedDPS = rollForRole("dps", remaining);
    newDPS.push(pickedDPS);
    remaining = removeFromGroup(pickedDPS, remaining);
  }
  const players = remaining
  return { players, newDPS };
};