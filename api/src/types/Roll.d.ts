type ValidRoll = {
  valid: boolean,
  errors: IApplicationError[]
}
interface RollInputParam {
  rollType: string
  lockAfterOut: boolean
  theme: string
}

type PlayerCounts = {
  locked: number,
  inTheRoll: number,
  tanks: number,
  healers: number,
  dps: number,
}

type RollByRoleReturn = {
  tank: IPlayer;
  healer: IPlayer;
  dps: IPlayer[]
}

type RollReturn = {
  players: IPlayer[] | RollByRoleReturn,
  remaining: IPlayer[]
}

interface DPSObject {
  players: IPlayer[];
  remaining: IPlayer[];
}

type RollRouteContext = MyContext<RollReturn, {}>