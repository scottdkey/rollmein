interface ValidRoll {
  valid: boolean,
  errors: IApplicationError[]
}
interface RollInputParam {
  rollType: string
  lockAfterOut: boolean
  theme: string
}

interface PlayerCounts {
  locked: number,
  inTheRoll: number,
  tanks: number,
  healers: number,
  dps: number,
}

interface RollByRoleReturn {
  tank: IPlayer;
  healer: IPlayer;
  dps: IPlayer[]
}

interface RollReturn {
  players: IPlayer[] | RollByRoleReturn,
  remaining: IPlayer[]
}

interface DPSObject {
  players: IPlayer[];
  remaining: IPlayer[];
}