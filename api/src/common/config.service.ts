import { addToContainer } from "../container";
import dotenv from "dotenv"
import { Logger, LoggerService } from "./logger.service"

export interface IServerConfig {
  [key: string]: any
  dev: boolean
  prod: boolean
  test: boolean
  cors_uri: string | undefined
  port: number
  secretKey: string
  cookieName: string
}

@addToContainer()
export class ConfigService {
  logger: Logger
  constructor(private ls: LoggerService) {
    this.logger = this.ls.getLogger(ConfigService.name)
    dotenv.config()

    this.validateConfig(
      [
        {
          configName: "ServerConfig",
          configObject: this.ServerConfig()
        },
        {
          configName: "FirebaseConfig",
          configObject: this.FirebaseConfig()
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
  }

  FirebaseConfig() {
    const { FIREBASE_PROJECT_ID, FIREBASE_KEY_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_AUTH_URI, FIREBASE_TOKEN_URI, FIREBASE_AUTH_PROVIDER_x509_CERT_URL, FIREBASE_PROVIDER_CLIENT__x509_CERT_URL } = process.env


    const config = {
      type: 'service_account',
      project_id: FIREBASE_PROJECT_ID,
      private_key_id: FIREBASE_KEY_ID,
      private_key: FIREBASE_PRIVATE_KEY,
      client_email: FIREBASE_CLIENT_EMAIL,
      client_id: FIREBASE_CLIENT_ID,
      auth_uri: FIREBASE_AUTH_URI,
      token_uri: FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
      client_x509_cert_url: FIREBASE_PROVIDER_CLIENT__x509_CERT_URL
    }
    return config
  }

  ServerConfig(): IServerConfig  {
    const { SECRETKEY, PORT, CORS_URL } = process.env
    return {
      dev: process.env.NODE_ENV === 'development',
      prod: process.env.NODE_ENV === 'production',
      test: process.env.NODE_ENV === 'test',
      cors_uri: CORS_URL,
      port: parseInt(PORT as string),
      secretKey: SECRETKEY as string,
      cookieName: 'qid',
    }
  }

  PgConfig(): {
    user: string | undefined
    password: string | undefined
    host: string | undefined
    port: number | undefined
    database: string | undefined
  } {
    const { POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env
    return {
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT || "0"),
      database: POSTGRES_DATABASE
    }
  }

  RedisConfig(): { host: string } {
    return {
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost'
    }
  }

  private validateConfig(configObjects: { configObject: { [key: string]: any }, configName: string }[]): void {
    configObjects.forEach(c => {
      const { configObject, configName } = c
      for (const key of Object.keys(configObject)) {
        const value = configObject[key]
        if (value === null || value === undefined) {
          console.error({ message: `no undefined keys in ${configName} config -- key:${key} value:${value}` })
          this.logger.error({ message: `no undefined keys in ${configName} config -- key:${key} value:${value}` })
        }
      }
    })
  }
}