import { Player } from "../../entites/Player";
import Players from "./Players"

export interface DPSObject {
  newDPS: Array<Player>;
  players: Array<Player>;
}

const rollForRole = (role: string, players: Array<Player>): Player => {
  const group: Array<Player> = players.filter(
    (player) => player[role as keyof Player] === true
  );
  return rollWithLocked(group)
};
function createInGroup(playersArray: Array<Player>): Array<Player> {
  return playersArray.filter((player) => player.inTheRoll === true);
}

const rollWithLocked = (players: Array<Player>): Player => {
  const locked = players.filter((p: Player) => p.locked === true);
  const outGroup = players.filter((p: Player) => p.locked === false)
  let pickedPlayer: Player;
  if (locked.length > 0) {
    pickedPlayer = randomFromArray(locked);
  } else {
    pickedPlayer = randomFromArray(outGroup);
  }
  return pickedPlayer
}
const randomFromArray = (players: Array<Player>) => {
  return players[Math.floor(Math.random() * players.length)];
};

const removeFromGroup = (
  pickedPlayer: Player,
  remainingPlayers: Array<Player>
) => {
  const newRollGroup = remainingPlayers.filter(
    (player) => player.id !== pickedPlayer.id
  );
  return newRollGroup;
};
const rollForDps = (currentGroup: Array<Player>) => {
  let remaining = currentGroup;

  const newDPS: Array<Player> = [];
  for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
    const pickedDPS = rollForRole("dps", remaining);
    newDPS.push(pickedDPS);
    remaining = removeFromGroup(pickedDPS, remaining);
  }
  const players = remaining
  return { players, newDPS };
};

const FFARoll = (currentGroup: Array<Player>) => {
  let remaining = currentGroup
  const players: Array<Player> = []
  for (let i = 1; i <= 5; i++) {
    const pickedPlayer = rollWithLocked(remaining)
    players.push(pickedPlayer)
    remaining = removeFromGroup(pickedPlayer, remaining)
  }
  return { players, remaining }
}

const rollByRole = (arrayOfPlayers: Array<Player>) => {
  let remaining = arrayOfPlayers;
  const tank: Player = rollForRole("tank", remaining);
  remaining = removeFromGroup(tank, remaining);
  const healer: Player = rollForRole("healer", remaining);
  remaining = removeFromGroup(healer, remaining);
  const dpsRoll: DPSObject = rollForDps(remaining);
  const dps = dpsRoll.newDPS
  const remainder = dpsRoll.players
  return { tank, healer, dps, remainder };
};

const inCheck = (playerCount: number) => {
  if (playerCount >= 6) {
    return true;
  } else {
    return false;
  }
};

const countRoles = async (uuid: string) => {
  const players = await Players.getAllPlayers(uuid)

  const tanks = players.reduce((n, player) => {
    const increment = player.tank === true && player.inTheRoll === true ? 1 : 0;
    return n + increment;
  }, 0);
  const healers = players.reduce((n, player) => {
    const increment = player.healer === true && player.inTheRoll === true ? 1 : 0;
    return n + increment;
  }, 0);
  const dps = players.reduce((n, player) => {
    const increment = player.dps === true && player.inTheRoll === true ? 1 : 0;
    return n + increment;
  }, 0);
  const inGroupCount = players.reduce((n, player) => {
    const increment = player.inTheRoll === true ? 1 : 0;
    return n + increment;
  }, 0);
  return { tanks, healers, dps, inGroupCount };
};

export default { inCheck, rollByRole, FFARoll, createInGroup, countRoles }