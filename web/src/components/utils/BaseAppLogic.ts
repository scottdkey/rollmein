import { PlayerObject } from "../../types/Interfaces";

const validCheck = (playersArray: Array<PlayerObject>) => {
  const roleCount = countRoles(playersArray);
  const tanks = roleCount.tanks > 0;
  const dps = roleCount.dps >= 3;
  const healers = roleCount.healers > 0;
  const rolesValid = tanks === true && dps === true && healers === true
  const groupValid = playersArray ? playersArray.length >= 6 : 0;

  const isValid = groupValid === true && rolesValid === true;
  return isValid;
};

const countRoles = (playersArray: Array<PlayerObject>) => {
  const players = playersArray ? playersArray : placeHolderArray;

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
  const inGroupCount = players.reduce((n, player) => {
    let increment = player.in === true ? 1 : 0;
    return n + increment;
  }, 0);
  return { tanks, healers, dps, inGroupCount };
};

function createInGroup(playersArray: Array<PlayerObject>) {
  return playersArray.filter((player) => player.in === true);
}


const placeHolderArray: Array<PlayerObject> = [
  {
    name: "",
    tank: false,
    dps: false,
    healer: false,
    locked: false,
    in: false,
    id: 999999,
    user_id: "placeHolder",
    createdAt: "placeHolder",
    updatedAt: "placeHolder",
  },
];

export { createInGroup, countRoles, validCheck }
