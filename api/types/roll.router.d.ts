interface IPlayerInCountRequestBody {
  players: IPlayer[]
}

interface IAddPlayerRequestBody {
  playerId: string,
  groupId: string
}

interface IAddPlayerReturnBody {
  success: boolean
}

interface FFARollResponse {
  players: IPlayer[],
  remaining: IPlayer[]
}

interface RollStartRequest {
  groupId?: string 
}

interface RollStartResponse {
  success: boolean
  message?: string
}

interface ByRoleResponse {
  tank: IPlayer,
  dps: IPlayer[],
  healer: IPlayer,
  remaining: IPlayer[]
}