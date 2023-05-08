interface PlayerCounts {
  locked: number,
  inTheRoll: number,
  tanks: number,
  healers: number,
  dps: number,
}

interface RollReturn {
  started: boolean,
  currentRoll: IRoll | null,
  previousRolls: PreviousRoll[],
  remainingPlayers: string[],
  lastCompletedTimestamp: Date | null
}

interface IRoll {
  tank: string | null
  healer: string | null
  dps: string[] | null
  ffa: string[] | null
}

interface IPreviousRoll {
  roll: IRoll,
  timestamp: Date
}