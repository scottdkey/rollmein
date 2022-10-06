import { Logger, LoggerService } from './logger.service';
import { dbToIsoString } from '../utils/date.util';
import { ApplicationError, DatabaseError } from '../utils/errorsHelpers';
import { ConfigService } from './config.service';
import { addToContainer } from "../container";
import { Pool, PoolClient } from "pg"
import { DataResponse } from '../types/DataResponse';

@addToContainer()
export class DatabaseService {
  private pool: Pool
  private logger: Logger
  constructor(private cs: ConfigService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(DatabaseService.name)
    const { host, user, password, port, database } = this.cs.PgConfig()
    this.pool = new Pool({
      host,
      user,
      password,
      port,
      database,
      max: 15,
      min: 3,
      idleTimeoutMillis: 600000,
      log: (messages: unknown[]) => {
        this.logger.info(JSON.stringify(messages))
      }
    })
  }

  async query<D, T>(text: string, params: unknown[], mapToCamelCase: (data: D) => T): Promise<DataResponse<T[]>> {
    const client: PoolClient = await this.pool.connect()
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
        error: DatabaseError("This query retrieved no rows")
      }
    } catch (e) {
      console.error(e)
      return {
        data: null,
        success: false,
        error: DatabaseError(e.message)
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
        error: ApplicationError(e.message)
      }
    }
  }
}