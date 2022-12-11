import { DatabaseService } from "../common/database.service";
import { DataServiceAbstract } from "../common/dataService.abstract";
import { Logger, LoggerService } from "../common/logger.service";
import { addToContainer } from "../container";
import { DbUser, RegisterUser, User } from "../types/user";

@addToContainer()
export class UserRepository extends DataServiceAbstract<DbUser, User>{
  db: DatabaseService
  private logger: Logger
  constructor(private database: DatabaseService, private ls: LoggerService) {
    super()
    this.db = this.database
    this.logger = this.ls.getLogger(UserRepository.name)
  }

  mapToCamelCase = (data: DbUser): User => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      googleId: data.google_id,
      appleId: data.apple_id,
      firebaseId: data.firebase_id,
      refreshToken: data.refresh_token,
      createdAt: new Date(data.created_at).toISOString(),
      updatedAt: new Date(data.created_at).toISOString()
    }
  }

  async getUserByFirebaseId(firebaseId: string) {
    const query = 'SELECT * FROM public.user WHERE firebase_id=$1'
    const params = [firebaseId]
    const res = await this.returnOne(query, params)
    this.logger.debug({ message: '#getUserByFirebaseId', res })
    return res
  }

  async getUserById(userId: string) {
    const query = 'SELECT * FROM public.user WHERE id=$1'
    const params = [userId]
    return await this.returnOne(query, params)
  }
  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM public.user WHERE email=$1'
    const params = [email]
    const res = await this.returnOne(query, params)
    this.logger.debug({ message: '#getUserByEmail', res })
    return res
  }

  async userFuzzySearch(input: string) {
    const query = 'SELECT * FROM public.user WHERE username LIKE $1 OR email LIKE $1'
    const params = [input]
    return await this.returnMany(query, params)
  }

  async addGoogleId(googleId: string, id: string) {
    const query = `UPDATE public.user SET google_id=$1 WHERE id=$2 RETURNING *`
    const values = [googleId, id]
    return await this.returnOne(query, values)
  }

  async addAppleId(appleId: string, id: string) {
    const query = `UPDATE public.user SET apple_id=$1 WHERE id=$2 RETURNING *`
    const values = [appleId, id]
    return await this.returnOne(query, values)
  }

  async createUser({ username, email, firebaseId, refreshToken }: RegisterUser) {
    const query = `INSERT INTO public.user (email, username, firebase_id, refresh_token) VALUES ($1, $2, $3, $4) RETURNING *`
    const values = [email, username, firebaseId, refreshToken]
    return await this.returnOne(query, values)
  }
  async updateUserProfile(username: string) {
    const query = `UPDATE public.user SET username=$1 RETURNING *`
    const values = [username]
    return await this.returnOne(query, values)
  }


}