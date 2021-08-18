import { Player } from "../entites/Player";
import { BasicError } from "./errorsHelpers";


type PlayerCounts = {
  locked: number,
  inTheRoll: number,
  tanks: number,
  healers: number,
  dps: number,
}

type RollByRoleReturn = {
  tank: Player;
  healer: Player;
  dps: Player[]
}

export type RollReturn = {
  players: Player[] | RollByRoleReturn,
  remaining: Player[]
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

export const rollForDps = (currentGroup: Player[]) => {
  let remaining = currentGroup;

  const players: Player[] = [];
  for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
    const pickedDPS = rollForRole("dps", remaining);
    players.push(pickedDPS);
    remaining = removeFromGroup(pickedDPS, remaining);
  }
  return { remaining, players };
};


export const FFARoll = (currentGroup: Player[]) => {
  let remaining = currentGroup
  const players: Player[] = []
  for (let i = 1; i <= 5; i++) {
    const pickedPlayer = rollWithLocked(remaining)
    players.push(pickedPlayer)
    remaining = removeFromGroup(pickedPlayer, remaining)
  }
  return { players, remaining }
}

export const rollByRole = (currentGroup: Player[]) => {
  let remaining = currentGroup;
  const tank: Player = rollForRole("tank", remaining);
  remaining = removeFromGroup(tank, remaining);
  const healer: Player = rollForRole("healer", remaining);
  remaining = removeFromGroup(healer, remaining);
  const dpsRoll: DPSObject = rollForDps(remaining);
  const dps = dpsRoll.players

  const players = { tank, healer, dps }
  return { players, remaining: dpsRoll.remaining };
};

export const inCheck = (players: Player[]) => {
  return players.filter(p => p.locked).length
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


type ValidRoll = {
  valid: Boolean,
  errors: BasicError[]
}

export const validRoll = (players: Player[], rollType: string): ValidRoll => {
  const playerCounts = PlayerCounts(players, rollType)
  const errorArray: BasicError[] = []
  const isRoleBased = rollType === "role"
  if (isRoleBased && playerCounts.tanks === 0) {
    errorArray.push({
      type: "invalidRoll",
      message: "must have a tank"

    })

  }
  if (isRoleBased && playerCounts.dps >= 3) {
    errorArray.push({
      type: "invalidRoll",
      message: "must have at least 3 dps"
    }
    )

  }
  if (isRoleBased && playerCounts.healers === 0) {
    errorArray.push({
      type: "invalidRoll",
      message: "must have a healer"
    }
    )

  }
  if (playerCounts.inTheRoll > 5) {
    errorArray.push({
      type: "invalidRoll",
      message: "must have more than 5 players"
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