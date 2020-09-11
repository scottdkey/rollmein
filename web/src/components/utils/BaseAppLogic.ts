import { PlayerObject } from "./Interfaces";

export const validCheck = (playersArray: Array<PlayerObject>) => {
  const roleCount = countRoles(playersArray);
  const tanks = roleCount.tanks > 0;
  const dps = roleCount.dps >= 3;
  const healers = roleCount.healers > 0;

  const rolesValid = tanks && dps && healers;
  const groupValid = playersArray.length >= 5;

  const isValid = groupValid === true && rolesValid === true;
  return isValid;
};

export const countRoles = (playersArray: Array<PlayerObject>) => {
  const players = playersArray ? playersArray : blankPlayer;

  const tanks = players.reduce((n, player) => {
    let increment = player.tank === true && player.in === true ? 1 : 0;
    return n + increment;
  }, 0);
  const healers = players.reduce((n, player) => {
    let increment = player.healer === true && player.in === true ? 1 : 0;
    return n + increment;
  }, 0);
  const dps = players.reduce((n, player) => {
    let increment = player.dps === true && player.in === true ? 1 : 0;
    return n + increment;
  }, 0);
  return { tanks, healers, dps };
};

export const createInGroup = (playersArray: Array<PlayerObject>) =>
  playersArray.filter((player) => player.in === true);

export const blankPlayer: Array<PlayerObject> = [
  {
    name: "",
    tank: false,
    dps: false,
    healer: false,
    locked: false,
    in: false,
    id: 0,
  },
];