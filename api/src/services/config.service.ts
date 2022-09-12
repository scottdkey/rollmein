import { addToContainer } from "../container";
import dotenv from "dotenv"


@addToContainer()
export class ConfigService {
  constructor() {
    dotenv.config()
  }

  ServerConfig(): {
    prod: boolean
    test: boolean
    uri: string
    port: number
    secretKey: string
    cookieName: string
  } {
    const { SECRETKEY, PORT, CORS_URL } = process.env
    return {
      prod: process.env.NODE_ENV === 'production',
      test: process.env.NODE_ENV === 'test',
      uri: CORS_URL ? CORS_URL : "http://localhost:3000",
      port: PORT ? parseInt(PORT) : 9000,
      secretKey: SECRETKEY ? SECRETKEY : "developmentKey",
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