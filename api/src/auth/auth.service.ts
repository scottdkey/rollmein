import { SetOption } from "cookies";
import { addToContainer } from "../container";
import { ValidateRequestBody } from "./auth.router";
import { IFirebaseInfo } from "../types/context";
import { DataResponse } from "../types/DataResponse";
import { RegisterUser, User } from "../types/user";
import { UnknownProblemError } from "../utils/errorsHelpers";
import { ConfigService } from "../common/config.service";
import { Logger, LoggerService } from "../common/logger.service";
import { RedisKeys, RedisService } from "../common/redis.service";
import { UserService } from "../user/user.service";
import { v4 as uuid } from "uuid";


@addToContainer()
export class AuthService {
  private logger: Logger
  private serverConfig: any
  constructor(private userService: UserService, private ls: LoggerService, private config: ConfigService, private redis: RedisService) {
    this.serverConfig = this.config.ServerConfig()
    this.logger = this.ls.getLogger(AuthService.name)

  }

  getAuthKey(userId: string) {
    return `session:${userId}`
  }

  async createSession(user: User): Promise<{ error: AppError | null, success: boolean, id: string | null }> {
    const id = uuid()
    const session = await this.redis.setWithRetry(RedisKeys.SESSION, id, user, 4, 604800)
    if (session.success) {
      return {
        error: null,
        success: session.success,
        id
      }
    }
    if (session.error && !session.success) {
      return {
        error: session.error,
        success: session.success,
        id: null
      }
    }
    return {
      error: {
        message: "something went wrong creating session",
        type: "#createSession error"
      },
      success: false,
      id: null
    }
  }

  async getSession(sessionId: string) {
    return await this.redis.get<User>(RedisKeys.SESSION, sessionId)
  }

  async updateSession(sessionId: string, user: User) {
    return await this.redis.setWithRetry<User>(RedisKeys.SESSION, sessionId, user)

  }

  getDaysFromNow(days: number = 7) {
    var today = new Date();
    var expire = new Date();
    return new Date(expire.setTime(today.getTime() + 3600000 * 24 * days))
  }

  cookieOptions(): SetOption {
    return {
      httpOnly: true,
      domain: this.serverConfig.prod ? this.serverConfig.cors_uri : 'localhost',
      path: '/',
      secure: this.serverConfig.prod,
      sameSite: "lax",
      expires: this.getDaysFromNow()
    }
  }

  async login(user: User) {
    try {
      const session = await this.createSession(user)
      return { cookieName: this.serverConfig.cookieName, sessionId: session.id, cookieOptions: this.cookieOptions() };
    } catch (e) {
      this.logger.error({ message: "problem logging in", error: e })
      return {
        cookieName: this.serverConfig.cookieName,
        sessionId: null,
        cookieOptions: { ...this.cookieOptions(), expires: new Date() }
      }
      
    }
  }

  async clearSession(sessionId: string){
    await this.redis.setWithRetry(RedisKeys.SESSION, sessionId, null, 3, new Date().getTime())
  }

 logout() {
    return {
      cookieName: this.serverConfig.cookieName,
      sessionId: null,
      cookieOptions: { ...this.cookieOptions(), expires: new Date() }
    }
  }

  async ensureUserExists(body: ValidateRequestBody, payload: IFirebaseInfo): Promise<DataResponse<User>> {
    try {
      let returnError: AppError = UnknownProblemError(new Error('unknown problem ocurred in #ensureUserExists'))
      const user = await this.userService.getByFirebaseId(payload.firebaseId)

      if (user.success) {
        return user
      }
      if (user.error) {
        returnError = user.error
      }
      if (!user.data && !user.success) {
        const registerUser: RegisterUser = {
          username: null,
          email: payload.email,
          googleId: payload.googleId || null,
          appleId: payload.appleId || null,
          firebaseId: payload.firebaseId,
          refreshToken: body.refreshToken

        }
        const registeredUser = await this.userService.register(registerUser)
        if (registeredUser.success) {
          return registeredUser
        }
        if (!registeredUser.success && registeredUser.error) {
          returnError = registeredUser.error
        }
      }
      return {
        data: null,
        success: false,
        error: returnError
      }
    } catch (e) {
      this.logger.error({ message: "error occurred on #ensureUserExists", ...e })
      return {
        data: null,
        success: false,
        error: e
      }
    }
  }
}