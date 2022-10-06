import { LoggerService } from './logger.service';
import { DataResponse } from '../types/DataResponse';
import { NotInRedisError, RedisError } from '../utils/errorsHelpers';
import { ConfigService } from './config.service';
import { addToContainer } from "../container";
import IoRedis, { Redis } from 'ioredis'

export enum RedisKeys {

}

@addToContainer()
export class RedisService {
  redis: Redis

  constructor(private cs: ConfigService, private ls: LoggerService) {
    const logger = this.ls.getLogger("Redis Service")
    const config = this.cs.RedisConfig()
    try {
      this.redis = new IoRedis({
        host: config.host
      })
      logger.info("connected to redis")
    } catch (e) {
      logger.error('unable to connect to redis')
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

  async set<T>(key: RedisKeys, id: string, data: T): Promise<DataResponse<T>> {
    const res = await this.redis.set(`${key}-${id}`, JSON.stringify(data), 'ex', 3600)
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

  async setWithRetry<T>(key: RedisKeys, id: string, data: T, retry: number): Promise<DataResponse<T>> {
    let res = this.set(key, id, data)
    let retryCount = 0
    while (!res && retryCount > retry) {
      res = this.set(key, id, data)
      retryCount++
    }
    return res
  }
}