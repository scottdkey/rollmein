export const userTable = "users"

export default class User implements UserInterface {
  public id!: string;
  public email?: string;
  public username?: string;
  public password?: string;
  public appleAuth?: string;
  public googleAuth?: string;
  public readonly createdAt!: Date;
  public readonly lastLogin!: Date;

  constructor(params: UserInterface) {
    this.id = params.id
    this.email = params.email
    this.username = params.username
    this.password = params.password
    this.appleAuth = params.appleAuth
    this.googleAuth = params.googleAuth
    this.createdAt = params.createdAt
    this.lastLogin = params.lastLogin
  }
}
export interface UserInterface {
  id: string;
  email?: string;
  username?: string;
  password?: string;
  appleAuth?: string;
  googleAuth?: string;
  createdAt: Date;
  lastLogin: Date;
}
