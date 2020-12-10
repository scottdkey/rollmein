export interface KnexConfigObject {
  client: string;
  migrations: object;
  seeds: object;
  connection: object;
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
  password: string;
}
export interface UserObject {
  id: number;
  email: string;
  password: string;
  username: string;
}

