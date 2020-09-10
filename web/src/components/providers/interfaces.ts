export type roleType = { [key: string]: boolean };

export interface PlayerObject {
  name: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in: boolean;
  id: number;
}
export interface DPSObject {
  newDPS: Array<PlayerObject>;
  players: Array<PlayerObject>;
}

export interface UserObject {
  id: number,
  email: string,
  username: string,
  password: string,
}
