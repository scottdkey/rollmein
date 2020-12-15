export const userTable = "users"

class User implements UserInterface {
  public id!: string;
  public email?: string;
  public username?: string;
  public password?: string;
  public apple_auth?: string;
  public google_auth?: string;
  public readonly created_at!: Date;
  public readonly last_login!: Date;

  constructor(params: UserInterface) {
    this.id = params.id
    this.email = params.email
    this.username = params.username
    this.password = params.password
    this.apple_auth = params.apple_auth
    this.google_auth = params.google_auth
    this.created_at = params.created_at
    this.last_login = params.last_login
  }
}
interface UserInterface {
  id: string;
  email?: string;
  username?: string;
  password?: string;
  apple_auth?: string;
  google_auth?: string;
  created_at: Date;
  last_login: Date;
}



export default User