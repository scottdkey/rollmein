import dotenv from "dotenv";
import { Logger } from "pino";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import * as process from "process";
import { v4 } from "uuid";

export interface IServerConfig {
  [key: string]: any;
  dev: boolean;
  prod: boolean;
  test: boolean;
  cors_uri: string | undefined;
  port: number;
  secretKey: string;
  cookieName: string;
  websocketHost: string;
  websocketPort: number;
  devKey: string | null;
  websocketKey: string;
}

export interface IGoogleOauth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

@addToContainer()
export class ConfigService {
  logger: Logger;
  serverConfig = this.ServerConfig();
  pgConfig = this.PgConfig();
  redisConfig = this.RedisConfig();
  googleOauth2Config = this.GoogleOauth2Config();
  constructor(private ls: LoggerService) {
    this.logger = this.ls.getLogger(ConfigService.name);
    dotenv.config();

    this.validateConfig([
      {
        configName: "ServerConfig",
        configObject: this.serverConfig,
      },
      {
        configName: "PgConfig",
        configObject: this.pgConfig,
      },
      {
        configName: "RedisConfig",
        configObject: this.redisConfig,
      },
      {
        configName: "GoogleOauth2Config",
        configObject: this.googleOauth2Config,
      },
    ]);
  }

  GoogleOauth2Config() {
    const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

    const config: IGoogleOauth2Config = {
      clientId: GOOGLE_ID as string,
      clientSecret: GOOGLE_SECRET as string,
      redirectUri: `${this.ServerConfig().cors_uri}/api/auth/callback/google`,
    };
    return config;
  }

  private ServerConfig(): IServerConfig {
    const { SECRETKEY, PORT, CORS_URL } = process.env;
    return {
      dev: process.env.NODE_ENV === "development",
      prod: process.env.NODE_ENV === "production",
      test: process.env.NODE_ENV === "test",
      cors_uri: CORS_URL,
      port: parseInt(PORT as string),
      secretKey: SECRETKEY as string,
      cookieName: "qid",
      websocketHost: process.env.WEBSOCKET_HOST as string,
      websocketPort: parseInt(process.env.WEBSOCKET_PORT as string),
      //only give a value if is development and if value is present
      devKey: process.env.DEV_KEY
        ? process.env.NODE_ENV === "development"
          ? (process.env.DEV_KEY as string)
          : null
        : null,
      websocketKey: process.env.WEBSOCKET_KEY || v4(),
    };
  }

  private PgConfig(): {
    user: string | undefined;
    password: string | undefined;
    host: string | undefined;
    port: number | undefined;
    database: string | undefined;
  } {
    const {
      POSTGRES_DATABASE,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_HOST,
      POSTGRES_PORT,
    } = process.env;
    return {
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT || "0"),
      database: POSTGRES_DATABASE,
    };
  }

  private RedisConfig(): { host: string; port: number } {
    return {
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    };
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
            message: `no undefined keys allowed in ${configName} config -- key:${key} value:${value}`,
          });
          this.logger.error({
            message: `no undefined keys allowed in ${configName} config -- key:${key} value:${value}`,
          });
        }
      }
    });
  }
}
