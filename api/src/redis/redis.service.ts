import { NotInRedisError, RedisError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import IoRedis, { Redis } from 'ioredis'
import { ConfigService } from '../common/config/config.service';
import { LoggerService } from '../logger/logger.service';

export enum RedisKeys {
  SESSION = 'session',
  GROUP = 'group'
}

@addToContainer()
export class RedisService {
  redis: Redis
  pub: Redis

  constructor(private cs: ConfigService, private ls: LoggerService) {
    const logger = this.ls.getLogger(RedisService.name)
    const config = this.cs.redisConfig
    try {
      this.redis = new IoRedis({
        host: config.host
      })
      this.pub = new IoRedis({
        host: config.host
      })
      logger.info({ message: "connected to redis" })

    } catch (e) {
      logger.error({ message: 'unable to connect to redis' })
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
      error: NotInRedisError(key, id)
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
      error: RedisError(key, id, data)
    }
  }


  //expire time is in seconds
  async setWithRetry<T>(key: RedisKeys, id: string, data: T, retry: number = 3, expireTime?: number): Promise<DataResponse<T>> {
    let res = this.set(key, id, data, expireTime)
    let retryCount = 0
    while (!res && retryCount > retry) {
      res = this.set(key, id, data, expireTime)
      retryCount++
    }
    return res
  }
  async publish<T>(key: RedisKeys, id: string, data: T) {
    await this.pub.publish(`${key}-${id}`, JSON.stringify(data))
  }
}