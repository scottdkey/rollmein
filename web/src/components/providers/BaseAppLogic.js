export const validCheck = (playersArray) => {
  const roleCount = countRoles(playersArray);
  const tanks = roleCount.tanks > 0;
  const dps = roleCount.dps >= 3;
  const healers = roleCount.healers > 0;

  const rolesValid = tanks && dps && healers;
  const groupValid = playersArray.length >= 5;

  const isValid = groupValid === true && rolesValid === true;
  return isValid;
};

export const countRoles = (playersArray) => {
  const tanks = playersArray.reduce((n, player) => {
    return n + (player.tank === true && player.in === true);
  }, 0);
  const healers = playersArray.reduce((n, player) => {
    return n + (player.healer === true && player.in === true);
  }, 0);
  const dps = playersArray.reduce((n, player) => {
    return n + (player.dps === true && player.in === true);
  }, 0);
  return { tanks, healers, dps };
};

export const createInGroup = (playersArray) => {
  const group = playersArray.filter((player) => player.in === true);
  return group;
};
