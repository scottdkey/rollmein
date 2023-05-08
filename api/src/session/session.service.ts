import { SetOption } from "cookies";
import { addToContainer } from "../container";
import { v4 as uuid } from "uuid";
import { Logger } from "pino";
import { IServerConfig, ConfigService } from "../common/config/config.service";
import { DateService } from "../common/date/date.service";
import { LoggerService } from "../logger/logger.service";
import { RedisService } from "../redis/redis.service";
import { RedisKeys } from "../../../shared/types/redisKeys.enum";


@addToContainer()
export class SessionService {
  private logger: Logger
  private serverConfig: IServerConfig
  constructor(private date: DateService, private config: ConfigService, private redis: RedisService, private loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(SessionService.name)
    this.serverConfig = this.config.serverConfig
  }


  cookieOptions(): SetOption {
    const { prod } = this.serverConfig
    return {
      httpOnly: true,
      domain: prod ? "scottkey.dev" : 'localhost',
      path: '/',
      secure: prod,
      sameSite: "lax",
      expires: this.date.getDaysFromNow(7)
    }
  }

  getCookieInfo() {
    return {
      name: this.serverConfig.cookieName,
      options: this.cookieOptions()
    }
  }

  async getSession(sessionId: string) {
    return await this.redis.get<CacheUser>(RedisKeys.SESSION, sessionId)
  }
  async refreshSession(sessionId: string) {
    return await this.redis.refreshExpire<CacheUser>(RedisKeys.SESSION, sessionId)
  }

  async setSession(sessionId: string, user: User) {
    try {
      const sessionExpiresInDays = 10
      const cacheUser: CacheUser = {
        ...user,
        sessionExpires: this.date.getDaysFromNow(sessionExpiresInDays).toISOString()
      }
      const sessionExpireInSeconds = this.date.secondsFromNumberOfDays(sessionExpiresInDays)
      await this.redis.setWithRetry(RedisKeys.SESSION, sessionId, cacheUser, 4, sessionExpireInSeconds)
      return sessionId
    } catch (e) {
      const error = {
        message: "error setting session",
        error: e.message,
        stacktrace: e.stacktrace
      }
      this.logger.error(error)
      throw error
    }
  }

  async clearSession(sessionId: string) {
    await this.redis.redis.del(RedisKeys.SESSION, sessionId)
  }

  async createSession(user: User) {
    try {
      const id = uuid()
      return await this.setSession(id, user)
    } catch (e) {
      const error = { message: 'unable to create session', error: e.message, stacktrace: e.stacktrace }
      this.logger.error(error)
      throw error
    }
  }
}