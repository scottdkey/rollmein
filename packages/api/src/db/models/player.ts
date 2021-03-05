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
  inTheRoll: boolean;
  userId: string;
}

