import { Pool, PoolClient } from "pg"
import { Logger } from "pino"
import { addToContainer } from "../../container"
import { LoggerService } from "../../logger/logger.service"
import { dbToIsoString } from "../../utils/date.util"
import { ConfigService } from "../config/config.service"
import { DataResponse } from "../../types/DataResponse"
import { ErrorTypes } from "../../types/ErrorCodes.enum"
import { ErrorMessages } from "../../utils/ErrorTypes.enum"

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

  async query<D, T>(text: string, params: unknown[], mapToCamelCase: (data: D) => T): Promise<DataResponse<T[]>> {
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
        return {
          data,
          success: true,
          error: null
        }
      }

      return {
        data: null,
        success: false,
        error: {
          message: ErrorMessages.NoRowsReturned,
          context: "#databaseService query",
          type: ErrorTypes.DB_ERROR,
          detail: "no rows returned"
        }
      }
    } catch (e) {
      this.logger.error({ ...e, message: "db query failed", text })
      return {
        data: null,
        success: false,
        error: {
          message: ErrorMessages.DatabaseError,
          stacktrace: e.stacktrace,
          context: "#databaseService query",
          type: ErrorTypes.DB_ERROR,
          detail: e.message
        }
      }
    } finally {
      client.release()
    }
  }

  async findOne<D, T>(text: string, params: unknown[], mapToCamelCase: (data: D) => T): Promise<DataResponse<T>> {
    try {
      const res = await this.query<D, T>(text, params, mapToCamelCase)
      if (res.data && res.success) {
        return {
          ...res,
          data: res.data[0]
        }
      }
      return {
        ...res,
        data: null
      }
    } catch (e) {
      return {
        data: null,
        success: false,
        error: e.message
      }
    }
  }
}