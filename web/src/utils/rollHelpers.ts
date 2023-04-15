export type Player = {
  id: number,
  name: string,
  tank: boolean,
  dps: boolean,
  healer: boolean,
  locked: boolean,
  inTheRoll: boolean
}

export type BasicError = {
  type: string,
  message: string
}

export type PlayerCounts = {
  locked: number,
  inTheRoll: number,
  tanks: number,
  healers: number,
  dps: number,
}

export type RollByRoleReturn = {
  tank: Player;
  healer: Player;
  dps: Player[]
}

export type RollReturn = {
  players: Player[] | RollByRoleReturn,
  remaining: Player[]
}

export type ValidRoll = {
  valid: boolean,
  errors: BasicError[]
}

interface DPSObject {
  players: Player[];
  remaining: Player[];
}
export const rollForRole = (role: string, players: Player[]): Player => {
  const group: Player[] = players.filter(
    (player) => player[role as keyof Player] === true
  );
  return rollWithLocked(group)
};

export const rollWithLocked = (players: Player[]) => {
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

export const randomFromArray = (players: Player[]) => {
  return players[Math.floor(Math.random() * players.length)];
};

export const removeFromGroup = (
  pickedPlayer: Player,
  remainingPlayers: Player[]
) => {
  const newRollGroup = remainingPlayers.filter(
    (player) => player.id !== pickedPlayer.id
  );
  return newRollGroup;
};

export const roll = (currentGroup: Player[], rollCount: number, role: string) => {
  let remaining = currentGroup;

  const players: Player[] = [];
  for (let count = 1; count < rollCount; count++) {
    const pickedDPS = rollForRole(role, remaining);
    players.push(pickedDPS);
    remaining = removeFromGroup(pickedDPS, remaining);
  }
  return { remaining, players };
};

export const getInGroup = (players: Player[]): Player[] => {
  return players.filter(player => player.inTheRoll == true)

}


export const FFARoll = (currentGroup: Player[], rollSize: number) => {
  let remaining = currentGroup
  const players: Player[] = []
  for (let i = 1; i <= rollSize; i++) {

    const pickedPlayer = rollWithLocked(remaining)
    players.push(pickedPlayer)
    remaining = removeFromGroup(pickedPlayer, remaining)
  }
  return { players, remaining }
}

export const rollByRole = (currentGroup: Player[], tankNumber: number, healerNumber: number, dpsNumber: number) => {
  let remaining = currentGroup;

  const tanksRoll = roll(currentGroup, tankNumber, "tank")
  remaining = tanksRoll.remaining
  const tanks = tanksRoll.players

  const healersRoll = roll(currentGroup, healerNumber, "healer");
  remaining = healersRoll.remaining
  const healers = healersRoll.players

  const dpsRoll = roll(currentGroup, dpsNumber, "dps");
  const dps = dpsRoll.players

  const players = { tanks, healers, dps }
  return { players, remaining: dpsRoll.remaining };
};

export const numberInTheRoll = (players: Player[]): number => {
  return players.filter(p => p.inTheRoll).length
};

export const PlayerCounts = (players: Player[], rollType: string): PlayerCounts => {
  const locked = players.filter(p => p.locked).length
  const inTheRoll = players.filter(p => p.inTheRoll)
  if (rollType === "role") {
    const tanks = inTheRoll.filter(p => p.tank).length
    const healers = inTheRoll.filter(p => p.healer).length
    const dps = inTheRoll.filter(p => p.dps).length
    return {
      locked,
      inTheRoll: inTheRoll.length,
      tanks,
      healers,
      dps
    }
  } else {
    return {
      locked,
      inTheRoll: inTheRoll.length,
      tanks: 0,
      healers: 0,
      dps: 0
    }
  }
};




export const isValidRoll = (
  players: Player[],
  rollType: string,
  tankNumber: number = 0,
  dpsNumber: number = 0,
  healerNumber: number = 0,
  rollSize: number = 5,
  inCount: number = 10,
): ValidRoll => {
  const playerCounts = PlayerCounts(players, rollType)
  const errorArray: BasicError[] = []
  const isRoleBased = rollType === "role"
  const playerText = inCount === 1 ? "player is" : "players are"

  if (inCount < rollSize) {
    errorArray.push({
      type: "size mismatch",
      message: `Only ${inCount} ${playerText} in the roll. Your roll size is ${rollSize}. Include more players in your roll`
    })

  }
  if (inCount === rollSize) {
    errorArray.push({
      type: "equal numbers",
      message: `you have the same amount in your rollsize and available players. No roll required`,
    })
  }

  if (isRoleBased && playerCounts.tanks <= tankNumber) {
    errorArray.push({
      type: "invalidRoll",
      message: `must have ${tankNumber} tank${tankNumber === 1 ? null : "s"}`
    })

  }
  if (isRoleBased && playerCounts.dps <= dpsNumber) {
    errorArray.push({
      type: "invalidRoll",
      message: `must have at least ${dpsNumber} dps`
    }
    )

  }
  if (isRoleBased && playerCounts.healers <= healerNumber) {
    errorArray.push({
      type: "invalidRoll",
      message: `must have ${healerNumber} healer${healerNumber === 1 ? null : "s"}`
    }
    )

  }

  if (errorArray.length > 0) {
    return {
      valid: false,
      errors: errorArray
    }
  } else {
    return {
      valid: true,
      errors: []
    }
  }


}