import dotenv from "dotenv";
import { Logger } from "pino";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { ServerConfig } from "./Server.config.js";
import { PostgresConfig } from "./Postgres.config.js";
import { RedisConfig } from "./Redis.config.js";

@addToContainer()
export class ConfigService {
  logger: Logger;
  serverConfig = ServerConfig();
  pgConfig = PostgresConfig();
  redisConfig = RedisConfig();
  constructor(private ls: LoggerService) {
    this.logger = this.ls.getLogger(ConfigService.name);
    dotenv.config();

    this.validateConfig([
      {
        configName: "ServerConfig",
        configObject: ServerConfig(),
      },
      {
        configName: "PgConfig",
        configObject: PostgresConfig(),
      },
      {
        configName: "RedisConfig",
        configObject: RedisConfig,
      },
    ]);
  }

  private validateConfig(
    configObjects: {
      configObject: { [key: string]: any };
      configName: string;
    }[]
  ): void {
    configObjects.forEach((c) => {
      const { configObject, configName } = c;
      for (const key of Object.keys(configObject)) {
        const value = configObject[key];
        if (value === null || value === undefined) {
          console.error({
            message: `no undefined keys in ${configName} config -- key:${key} value:${value}`,
          });
          this.logger.error({
            message: `no undefined keys in ${configName} config -- key:${key} value:${value}`,
          });
        }
      }
    });
  }
}
