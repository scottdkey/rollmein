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