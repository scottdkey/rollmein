import IoRedis, { Redis } from 'ioredis';
import { Logger } from 'pino';
import { ConfigService } from '../common/config/config.service';
import { addToContainer } from "../container";
import { LoggerService } from '../logger/logger.service';
import { RedisKeys } from '../../../web/src/types/redisKeys.enum';



@addToContainer()
export class RedisService {
  redis: Redis
  pub: Redis
  private logger: Logger
  private failureCount = 0
  private config = this.cs.redisConfig

  constructor(private cs: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(RedisService.name)
    this.connectClients()
  }
  private connectClients = () => {
    try {
      this.redis = new IoRedis({
        host: this.config.host
      })
      this.redis.on("error", (e) => {
        this.logger.error({
          message: e.message,
          context: "redis had an error"
        })
        this.failureCount++
        this.exitOnHighFailure()
      })
      this.pub = new IoRedis({
        host: this.config.host
      })
      this.pub.on("error", (e) => {
        this.logger.error({
          message: e.message,
          context: "redis publisher had an error"
        })
        this.failureCount++
        this.exitOnHighFailure()
      })
    } catch (e) {
      this.logger.error({ message: 'unable to connect to redis' })
    }
  }

  private exitOnHighFailure = () => {
    if (this.failureCount > 3) {

      process.exit()
    }
  }
  async get<T>(key: RedisKeys, id: string): Promise<T | null> {
    const res = await this.redis.get(`${key}-${id}`)
    if (res) {
      return await JSON.parse(res) as T
    }
    return null
  }

  async refreshExpire<T>(key: RedisKeys, id: string, expireTime?: number): Promise<T | null> {
    const data = await this.get<T>(key, id)
    if (data) {
      return await this.setWithRetry<T>(key, id, data, expireTime)
    }
    return data
  }

  //expire time is in seconds
  async set<T>(key: RedisKeys, id: string, data: T, expireTime = 7200): Promise<T | null> {
    const res = await this.redis.set(`${key}-${id}`, JSON.stringify(data), 'ex', expireTime)
    if (res === "OK") {
      return data
    }
    return res
  }


  //expire time is in seconds
  async setWithRetry<T>(key: RedisKeys, id: string, data: T, retry = 3, expireTime?: number) {
    let res = await this.set(key, id, data, expireTime)
    let retryCount = 0
    while (!res && retryCount > retry) {
      res = await this.set(key, id, data, expireTime)
      retryCount++
    }
    if (res) {
      return res
    }
    return null
  }
  async publish<T>(key: RedisKeys, id: string, data: T) {
    try {
      await this.pub.publish(`${key}-${id}`, JSON.stringify(data))
    } catch (e) {
      this.logger.error({
        message: e.message,
        context: "redis publisher had an error"
      })
    }
  }
}