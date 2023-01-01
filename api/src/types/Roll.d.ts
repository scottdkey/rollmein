import {MyContext} from "./Context";

type ValidRoll = {
  valid: boolean,
  errors: AppError[]
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
  tank: Player;
  healer: Player;
  dps: Player[]
}

type RollReturn = {
  players: Player[] | RollByRoleReturn,
  remaining: Player[]
}

interface DPSObject {
  players: Player[];
  remaining: Player[];
}

type RollRouteContext = MyContext<RollReturn>