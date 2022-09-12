import { UnknownProblemResponse } from '../utils/errorsHelpers';
import { signJwt } from '../utils/jwtUtils';
import { ApplicationError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import { DatabaseService } from "./database.service";
import { ConfigService } from "./config.service";
import { DataResponse } from '../types/DataResponse';
import { DbUser, User, UserResponse, UsersResponse } from '../types/user';
import { UserContext } from '../routers/user.router';
import { DataServiceAbstract } from './dataService.abstract';

@addToContainer()
export class UserService extends DataServiceAbstract<DbUser, User>{
  private readonly cookieName: string
  db: DatabaseService

  constructor(private database: DatabaseService, private cs: ConfigService) {
    super()
    this.db = this.database
    this.cookieName = this.cs.ServerConfig().cookieName
  }

  mapToCamelCase = (data: DbUser): User => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      googleId: data.google_id,
      appleId: data.apple_id,
      supabaseId: data.supabase_id,
      createdAt: new Date(data.created_at).toISOString(),
      updatedAt: new Date(data.created_at).toISOString()
    }
  }

  scrubbedResponse(res: DataResponse<User>, scrub?: boolean): DataResponse<User> {
    if (scrub && res.data) {
      const { id, username, email, createdAt, updatedAt } = res.data
      return {
        ...res,
        data: {
          id,
          username,
          email,
          createdAt,
          updatedAt
        }
      }
    }
    return res
  }

  scrubbedManyResponse(res: DataResponse<User[]>, scrub?: boolean): DataResponse<User[]> {
    if (scrub && res.data) {
      return {
        ...res,
        data: res.data.map(user => {
          const { id, username, email, createdAt, updatedAt } = user
          return {
            id,
            username,
            email,
            createdAt,
            updatedAt
          }
        })
      }
    }
    return res
  }


  async getUserById(userId: string, scrubQuery= true): Promise<DataResponse<User>> {
    const query = 'SELECT * FROM public.user WHERE id=$1'
    const params = [userId]
    const res = await this.returnOne(query, params)
    return this.scrubbedResponse(res, scrubQuery)
  }
  async getUserByEmail(email: string, scrubQuery = true): Promise<UserResponse> {
    const query = 'SELECT * FROM public.user WHERE email=$1'
    const params = [email]
    const res = await this.returnOne(query, params)
    return this.scrubbedResponse(res, scrubQuery)
  }

  async userFuzzySearch(input: string, scrubQuery = true): Promise<UsersResponse> {
    const query = 'SELECT * FROM public.user WHERE username LIKE $1 OR email LIKE $1'
    const params = [input]
    const res = await this.returnMany(query, params)
    return this.scrubbedManyResponse(res, scrubQuery)
  }

  async addGoogleId(googleId: string, id: string): Promise<UserResponse> {
    const query = `UPDATE public.user SET google_id=$1 WHERE id=$2`
    const values = [googleId, id]
    return this.scrubbedResponse(await this.returnOne(query, values))
  }

  async addAppleId(appleId: string, id: string): Promise<UserResponse> {
    const query = `UPDATE public.user SET apple_id=$1 WHERE id=$2`
    const values = [appleId, id]
    return this.scrubbedResponse(await this.returnOne(query, values))
  }

  async addSupabaseId(supabaseId: string, id: string): Promise<UserResponse> {
    const query = `UPDATE public.user SET supabase_id=$1 WHERE id=$2`
    const values = [supabaseId, id]
    return this.scrubbedResponse(await this.returnOne(query, values))
  }


  async register({ username, email, googleId, appleId, supabaseId }: { username: string, email: string, googleId?: string, appleId?: string, supabaseId?: string }): Promise<UserResponse> {
    try {
      const query = `INSERT INTO public.user (email, username) VALUES ($1, $2) RETURNING *`
      const values = [email, username]
      const userRes = await this.returnOne(query, values)
      if (userRes.data && googleId) {
        return await this.addGoogleId(googleId, userRes.data.id)
      }
      if (userRes.data && appleId) {
        return await this.addAppleId(appleId, userRes.data.id)
      }
      if (userRes.data && supabaseId) {
        return await this.addSupabaseId(supabaseId, userRes.data.id)
      }
      const error = new Error("something went wrong #UserService.register")
      console.error(error)
      return UnknownProblemResponse(error)
    }
    catch (e) {
      return {
        data: null,
        success: false,
        error: ApplicationError(e.message)
      }
    }
  }

  login(ctx: UserContext): UserContext {
    if(ctx.state.user && ctx.state.validUser){
      const jwt = signJwt(ctx.state.user.id)
      const now = new Date()
      const expires = new Date(now.setTime(now.getTime() + (30 * 24 * 60 * 60 * 1000)))
      ctx.cookies.set(this.cookieName, jwt, { domain: ctx.host, expires })
    } else {
      console.error('something went wrong when logging in')
    }
    return ctx
  }

  logout(ctx: UserContext): UserContext {
    ctx.cookies.set(this.cookieName, null, { domain: ctx.host, expires: new Date() })
    ctx.state.user = null
    return ctx
  }
}
