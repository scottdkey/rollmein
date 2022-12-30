import { LoggerService } from './logger.service';
import { NotInRedisError, RedisError } from '../utils/errorsHelpers';
import { ConfigService } from './config.service';
import { addToContainer } from "../container";
import IoRedis, { Redis } from 'ioredis'
import { DataResponse } from '../../../types/DataResponse';

export enum RedisKeys {
  SESSION = 'session'
}

@addToContainer()
export class RedisService {
  redis: Redis

  constructor(private cs: ConfigService, private ls: LoggerService) {
    const logger = this.ls.getLogger(RedisService.name)
    const config = this.cs.redisConfig
    try {
      this.redis = new IoRedis({
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

  //expire time is in seconds
  async set<T>(key: RedisKeys, id: string, data: T, expireTime?: number): Promise<DataResponse<T>> {
    const res = await this.redis.set(`${key}-${id}`, JSON.stringify(data), 'ex', expireTime || 3600)
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
}