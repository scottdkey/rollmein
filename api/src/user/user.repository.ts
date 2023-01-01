import { DatabaseService } from "../common/database.service";
import { DataServiceAbstract } from "../common/dataService.abstract";
import { addToContainer } from "../container";
import { DbUser, User, RegisterUser } from "../types/user";

@addToContainer()
export class UserRepository extends DataServiceAbstract<DbUser, User>{
  db: DatabaseService
  constructor(private database: DatabaseService) {
    super()
    this.db = this.database
  }

  mapToCamelCase = (data: DbUser): User => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      googleId: data.google_id,
      appleId: data.apple_id,
      githubId: data.github_id,
      createdAt: new Date(data.created_at).toISOString(),
      updatedAt: new Date(data.created_at).toISOString()
    }
  }

  async getUserByFirebaseId(firebaseId: string) {
    const query = 'SELECT * FROM public.user WHERE firebase_id=$1'
    const params = [firebaseId]
    return await this.returnOne(query, params)
  }

  async getUserByGoogleId(googleId: string) {
    const query = 'SELECT * FROM public.user WHERE google_id=$1'
    const params = [googleId]
    return await this.returnOne(query, params)
  }

  async getUserById(userId: string) {
    const query = 'SELECT * FROM public.user WHERE id=$1'
    const params = [userId]
    return await this.returnOne(query, params)
  }
  async getUserByEmail(email: string) {
    const query = 'SELECT * FROM public.user WHERE email=$1'
    const params = [email]
    return await this.returnOne(query, params)
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

  async createUser({ username, email, googleId, githubId, appleId }: RegisterUser) {
    const query = `INSERT INTO public.user (email, username, google_id, github_id, apple_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`
    const values = [email, username, googleId, githubId, appleId]
    return await this.returnOne(query, values)
  }
  async updateUserProfile(username: string) {
    const query = `UPDATE public.user SET username=$1 RETURNING *`
    const values = [username]
    return await this.returnOne(query, values)
  }


}