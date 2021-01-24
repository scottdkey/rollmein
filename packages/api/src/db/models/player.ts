export const playerTable = "players"

export default class Player implements playerInterface {
  public id!: number;
  public playerName!: string;
  public tank!: boolean;
  public healer!: boolean;
  public dps!: boolean;
  public locked!: boolean;
  public inTheRoll!: boolean;
  public userId!: string;

  constructor(params: playerInterface) {
    this.id = params.id
    this.playerName = params.playerName
    this.tank = params.tank
    this.healer = params.healer
    this.dps = params.dps
    this.locked = params.locked
    this.inTheRoll = params.inTheRoll
    this.userId = params.userId
  }
}

export interface playerInterface extends newPlayerInterface {
  id: number;

}
export interface newPlayerInterface {
  playerName: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
<<<<<<< HEAD:packages/api/src/db/models/player.ts
  in_the_roll: boolean;
  user_id: string;
}
=======
  inTheRoll: boolean;
  userId: string;
}


export default Player
>>>>>>> f5e0dfd7c6c96bddcd095febdd48a361ea5b5cfc:api/src/db/models/player.ts
