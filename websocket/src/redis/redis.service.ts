import Redis from "ioredis";
import { Logger } from "pino";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";

@addToContainer()
export class RedisService {
  redis: Redis;
  private logger: Logger;

  constructor(private cs: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(RedisService.name);
    this.redis = new Redis(this.cs.redisConfig.port, this.cs.redisConfig.host);
  }

  /**
   *
   * @param key redis primary key
   * @param id id of item in the key namespace
   * @returns data or null if not found
   */
  async get<T>(key: string, id: string) {
    const data = await this.redis.get(`${key}-${id}`);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  /**
   *
   * @param key primary redis key namespace
   * @param id id in that namespace
   * @param data data to set in k-v
   * @param expireTime time in seconds to keep in store will default to 10,000 sec otherwise
   * @returns the data that was just set
   */
  async set<T>(
    key: string,
    id: string,
    data: T,
    expireTime = 100000
  ): Promise<T | null> {
    const res = await this.redis.set(
      `${key}-${id}`,
      JSON.stringify(data),
      "EX",
      expireTime
    );

    this.logger.info(res);
    if (res === "OK") {
      return data;
    }
    return res as T | null;
  }

  /**
   *
   * @param key redis namespace key
   * @param id id of item in namespace
   * @param data object to set in redis, will be stringified
   * @param retry how many times to retry
   * @param expireTime time in seconds to keep in store will default to 10,000 sec otherwise
   * @returns data that was just set or null if error occurred
   */
  async setWithRetry<T>(
    key: string,
    id: string,
    data: T,
    retry = 3,
    expireTime?: number
  ) {
    let res = await this.set(key, id, data, expireTime);
    let retryCount = 0;
    while (!res && retryCount > retry) {
      res = await this.set(key, id, data, expireTime);
      retryCount++;
    }
    if (res) {
      return res;
    }
    return null;
  }

  /**
   *
   * @param key publishing to to a stream
   * @param data data payload to publish
   */
  async publish<T>(key: string, data: T) {
    try {
      await this.redis.publish(key, JSON.stringify(data));
    } catch (e) {
      this.logger.error(e, `redis publish error to ${key}`);
      throw e;
    }
  }

  async subscribe(key: string, handler: (data: any) => void) {}
}
