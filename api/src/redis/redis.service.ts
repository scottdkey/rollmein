import { RedisError } from '../../../shared/types/ErrorTypes.enum';
import { addToContainer } from "../container";
import IoRedis, { Redis } from 'ioredis'
import { ConfigService } from '../common/config/config.service';
import { LoggerService } from '../logger/logger.service';
import { Logger } from 'pino';
import { RedisKeys } from '../../../shared/types/redisKeys.enum';
import { DataResponse } from '../../../shared/types/DataResponse';



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
  async get<T>(key: RedisKeys, id: string): Promise<DataResponse<T>> {
    const res = await this.redis.get(`${key}-${id}`)
    if (res) {
      return {
        data: JSON.parse(res) as T,
        success: true,
        error: null
      }
    }
    return {
      data: null,
      success: false,
      error: RedisError(key, id, null, "unable to get data from redis")
    }
  }

  async refreshExpire<T>(key: RedisKeys, id: string, expireTime?: number) {
    const data = await this.get<T>(key, id)
    if (data.data) {
      return data.data && await this.setWithRetry<T>(key, id, data.data, expireTime)
    }
    return data

  }

  //expire time is in seconds
  async set<T>(key: RedisKeys, id: string, data: T, expireTime: number = 7200): Promise<DataResponse<T>> {
    const res = await this.redis.set(`${key}-${id}`, JSON.stringify(data), 'ex', expireTime)
    if (res) {
      return {
        data,
        success: true,
        error: null
      }
    }
    return {
      data,
      success: false,
      error: RedisError(key, id, data, 'unable to set data in redis')
    }
  }


  //expire time is in seconds
  async setWithRetry<T>(key: RedisKeys, id: string, data: T, retry: number = 3, expireTime?: number) {
    let res = await this.set(key, id, data, expireTime)
    let retryCount = 0
    while (!res && retryCount > retry) {
      res = await this.set(key, id, data, expireTime)
      retryCount++
    }
    if (res) {
      return res
    }
    return {
      data: null,
      success: false,
      error: RedisError(key, id, data, 'unable to setWithRetry in redis')
    }

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