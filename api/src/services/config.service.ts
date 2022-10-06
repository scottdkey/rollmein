import { addToContainer } from "../container";
import dotenv from "dotenv"
import { Logger, LoggerService } from "./logger.service";


@addToContainer()
export class ConfigService {
  logger: Logger
  constructor(private ls: LoggerService) {
    this.logger = this.ls.getLogger(ConfigService.name)
    dotenv.config()
    this.validateConfig(
      [
        {
          configName: "SupabaseConfig",
          configObject: this.SupabaseConfig()
        },
        {
          configName: "ServerConfig",
          configObject: this.ServerConfig()
        },
        {
          configName: "PgConfig",
          configObject: this.PgConfig()
        },
        {
          configName: "RedisConfig",
          configObject: this.RedisConfig()
        }

      ])
    this.logger.info(`postgres: ${JSON.stringify(this.PgConfig())}`)
    this.logger.info(`redis ${JSON.stringify(this.RedisConfig())}`)
  }

  SupabaseConfig(): {
    url: string,
    anonKey: string,
    jwt: string
  } {
    return {
      url: process.env.SUPABASE_URL as string,
      anonKey: process.env.SUPABASE_ANON_KEY as string,
      jwt: process.env.SUPABASE_JWT as string
    }
  }
  private validateConfig(configObjects: { configObject: { [key: string]: any }, configName: string }[]): void {
    configObjects.forEach(c => {
      const { configObject, configName } = c
      for (const key of Object.keys(configObject)) {
        const value = configObject[key]
        if (value === null || value === undefined) {
          this.logger.error(`no undefined keys in ${configName} config -- key:${key} value:${value}`)
        }
      }
    })
  }

  ServerConfig(): {
    [key: string]: any
    dev: boolean
    prod: boolean
    test: boolean
    uri: string
    port: number
    secretKey: string
    cookieName: string
  } {
    const { SECRETKEY, PORT, CORS_URL } = process.env
    return {
      dev: process.env.NODE_ENV === 'development',
      prod: process.env.NODE_ENV === 'production',
      test: process.env.NODE_ENV === 'test',
      uri: CORS_URL as string,
      port: parseInt(PORT as string),
      secretKey: SECRETKEY as string,
      cookieName: 'qid',
    }
  }

  PgConfig(): {
    user: string
    password: string
    host: string
    port: number
    database: string
  } {
    const { POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env
    return {
      user: POSTGRES_USER ? POSTGRES_USER : 'postgres',
      password: POSTGRES_PASSWORD ? POSTGRES_PASSWORD : 'postgres',
      host: POSTGRES_HOST ? POSTGRES_HOST : '0.0.0.0',
      port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
      database: POSTGRES_DATABASE ? POSTGRES_DATABASE : "rollmein_dev"
    }
  }

  RedisConfig(): { host: string } {
    return {
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost'
    }
  }

}