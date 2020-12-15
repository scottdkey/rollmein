export const playerTable = "players"

class Player implements playerInterface {
  public id!: number;
  public player_name!: string;
  public tank!: boolean;
  public healer!: boolean;
  public dps!: boolean;
  public locked!: boolean;
  public in_the_roll!: boolean;
  public user_id!: string;

  constructor(params: playerInterface) {
    this.id = params.id
    this.player_name = params.player_name
    this.tank = params.tank
    this.healer = params.healer
    this.dps = params.dps
    this.locked = params.locked
    this.in_the_roll = params.in_the_roll
    this.user_id = params.user_id
  }
}

export interface playerInterface {
  id: number;
  player_name: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in_the_roll: boolean;
  user_id: string;
}


export default Player