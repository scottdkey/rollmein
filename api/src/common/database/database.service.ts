import { Pool, PoolClient } from "pg"
import { Logger } from "pino"
import { addToContainer } from "../../container"
import { LoggerService } from "../../logger/logger.service"
import { dbToIsoString } from "../../utils/date.util"
import { ConfigService } from "../config/config.service"
import { ErrorTypes } from "../../../../shared/types/ErrorCodes.enum"
import { createError } from "../../utils/CreateError"

@addToContainer()
export class DatabaseService {
  private pool: Pool
  private logger: Logger
  constructor(private cs: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(DatabaseService.name)
    this.connect()
  }

  private connect() {
    const { host, user, password, port, database } = this.cs.pgConfig
    this.pool = new Pool({
      host,
      user,
      password,
      port,
      database,
      max: 15,
      min: 3,
      idleTimeoutMillis: 600000,
    })
    this.pool.on('error', (err) => {
      this.logger.error({ message: 'idle client error', err })
    })
  }

  async query<D, T>(text: string, params: unknown[], mapToCamelCase: (data: D) => T): Promise<T[] | null> {
    const client: PoolClient = await this.pool.connect()
    this.logger.debug({ message: 'performing query', text, params })
    try {
      const res = await client.query(text, params)
      if (res.rows.length > 0) {
        const data = mapToCamelCase ? res.rows.map(row => {
          const modifiableRow = row
          if (modifiableRow.created_at) {
            modifiableRow.created_at = dbToIsoString(modifiableRow.created_at)
          }
          if (modifiableRow.updated_at) {
            modifiableRow.updated_at = dbToIsoString(modifiableRow.updated_at)
          }
          return mapToCamelCase(modifiableRow)
        }) : res.rows as T[]
        this.logger.debug({ message: 'query result', data })
        return data
      }
      return null
    } catch (e) {
      const error = createError({
        message: e.message,
        stacktrace: e.stacktrace,
        context: "#databaseService query",
        type: ErrorTypes.DB_ERROR,
        detail: {
          text,
          params,
        }
      })
      this.logger.error(error)
      throw error
    } finally {
      client.release()
    }
  }

  async findOne<D, T>(text: string, params: unknown[], mapToCamelCase: (data: D) => T): Promise<T | null> {
    try {
      const res = await this.query<D, T>(text, params, mapToCamelCase)
      if (res) {
        return res[0]
      }
      return null
    } catch (e) {
      throw createError({
        message: e.message,
        stacktrace: e.stacktrace,
        context: "#databaseService findOne",
        type: ErrorTypes.DB_ERROR,
      })
    }
  }
}