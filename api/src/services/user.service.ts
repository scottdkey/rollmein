import { Logger, LoggerService } from './logger.service';
import { ApplicationError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import { DatabaseService } from "./database.service";
import { DataResponse } from '../types/DataResponse';
import { DbUser, RegisterUser, ScrubbedUserResponse, ScrubbedUsersResponse, User } from '../types/user';
import { DataServiceAbstract } from './dataService.abstract';

@addToContainer()
export class UserService extends DataServiceAbstract<DbUser, User>{
  db: DatabaseService
  private logger: Logger

  constructor(private database: DatabaseService, private ls: LoggerService) {
    super()
    this.db = this.database
    this.logger = this.ls.getLogger(UserService.name)
  }

  mapToCamelCase = (data: DbUser): User => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      googleId: data.google_id,
      appleId: data.apple_id,
      firebaseId: data.firebase_id,
      createdAt: new Date(data.created_at).toISOString(),
      updatedAt: new Date(data.created_at).toISOString()
    }
  }

  scrubbedResponse(res: DataResponse<User>, scrub?: boolean): ScrubbedUserResponse {
    if (scrub && res.data) {
      const { id, username } = res.data
      return {
        ...res,
        data: {
          id,
          username
        }
      }
    }
    return res
  }

  scrubbedManyResponse(res: DataResponse<User[]>, scrub?: boolean): ScrubbedUsersResponse {
    if (scrub && res.data) {
      return {
        ...res,
        data: res.data.map(user => {
          return {
            id: user.id,
            username: user.username
          }
        })

      }
    }
    return res
  }

  async getUserByFirebaseId(firebaseId: string) {
    const query = 'SELECT * FROM public.user WHERE firebase_id=$1'
    const params = [firebaseId]
    return await this.returnOne(query, params)
  }


  async getUserById(userId: string, scrubQuery = true) {
    const query = 'SELECT * FROM public.user WHERE id=$1'
    const params = [userId]
    return await this.returnOne(query, params)
  }
  async getUserByEmail(email: string, scrubQuery = true) {
    const query = 'SELECT * FROM public.user WHERE email=$1'
    const params = [email]
    return await this.returnOne(query, params)
  }

  async userFuzzySearch(input: string, scrubQuery = true) {
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


  async register({ username, email, googleId, appleId, firebaseId }: RegisterUser): Promise<DataResponse<User>> {
    try {
      const query = `INSERT INTO public.user (email, username, firebase_id) VALUES ($1, $2, $3) RETURNING *`
      const values = [email, username, firebaseId]
      const userRes = await this.returnOne(query, values)
      if (userRes.data && googleId) {
        const res = await this.addGoogleId(googleId, userRes.data.id)
        console.log(res)
        return res
      }
      if (userRes.data && appleId) {
        return await this.addAppleId(appleId, userRes.data.id)
      }
      return userRes
    }
    catch (e) {
      this.logger.error(ApplicationError(e.message))
      return {
        data: null,
        success: false,
        error: ApplicationError(e.message)
      }
    }
  }


}
