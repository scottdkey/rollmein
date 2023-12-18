import { createClient, RedisClientType } from "redis";
import { Logger } from "pino";
import { ConfigService } from "../config/config.service.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { RedisKeys } from "../types/redisKeys.enum.js";
import { v4 as uuidV4 } from "uuid";

@addToContainer()
export class RedisService {
  redis: RedisClientType;
  private logger: Logger;
  private failureCount = 0;

  constructor(private cs: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(RedisService.name);
    this.connect()
      .then((res) => {
        this.logger.debug(res, "redis connected");
      })
      .catch((e) => {
        this.logger.error(e);
      });
  }
  testKey = async () => {
    return await this.set(
      RedisKeys.AUTH,
      uuidV4(),
      JSON.stringify({ message: "test" }),
      10000
    );
  };

  private connect = async () => {
    try {
      const config = this.cs.redisConfig;
      await createClient({
        url: `redis://${config.host}:${config.port}`,
      })
        .on("error", (e) => {
          this.logger.error({
            message: e.message,
            context: "redis had an error",
          });
          this.failureCount++;
          this.exitOnHighFailure();
        })
        .connect()
        .then((data) => {
          this.redis = data as any;
        });
    } catch (e) {
      this.logger.error(e, { message: "unable to connect to redis" });
    }
  };

  private exitOnHighFailure = () => {
    if (this.failureCount > 3) {
      process.exit();
    }
  };
  async get<T>(key: RedisKeys, id: string): Promise<T | null> {
    const res = await this.redis.get(`${key}-${id}`);
    if (res) {
      return (await JSON.parse(res)) as T;
    }
    return null;
  }

  async refreshExpire<T>(
    key: RedisKeys,
    id: string,
    expireTime?: number
  ): Promise<T | null> {
    const data = await this.get<T>(key, id);
    if (data) {
      return await this.setWithRetry<T>(key, id, data, expireTime);
    }
    return data;
  }

  //expire time is in seconds
  async set<T>(
    key: RedisKeys,
    id: string,
    data: T,
    expireTime = 100000
  ): Promise<T | null> {
    const res = await this.redis.set(`${key}-${id}`, JSON.stringify(data), {
      EX: expireTime,
      NX: true,
    });

    console.log(res);
    if (res === "OK") {
      return data;
    }
    return res as T | null;
  }

  //expire time is in seconds
  async setWithRetry<T>(
    key: RedisKeys,
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
}
