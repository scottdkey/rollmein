import { Pool, PoolClient } from "pg";
import { Logger } from "pino";
import { addToContainer } from "../container";
import { LoggerService } from "../logger/logger.service";
import { ConfigService } from "../config/config.service";
import { DateService } from "../date/date.service";

@addToContainer()
export class DatabaseService {
  private pool: Pool;
  private logger: Logger;
  constructor(
    private cs: ConfigService,
    private ls: LoggerService,
    private dateService: DateService
  ) {
    this.logger = this.ls.getLogger(DatabaseService.name);
    const { host, user, password, port, database } = this.cs.pgConfig;
    this.pool = new Pool({
      host,
      user,
      password,
      port,
      database,
      max: 15,
      min: 3,
      idleTimeoutMillis: 600000,
    });
    this.pool.on("connect", () => {
      this.logger.info({ message: "connected to database" });
    });
    this.pool.on("error", (err) => {
      this.logger.error({ message: "idle client error", err });
    });
  }

  async query<D, T>(
    text: string,
    params: unknown[],
    mapToCamelCase: (data: D) => T
  ): Promise<T[] | null> {
    const client: PoolClient = await this.pool.connect();
    this.logger.debug({ message: "performing query", text, params });
    try {
      const res = await client.query(text, params);
      if (res.rows.length > 0) {
        const data = mapToCamelCase
          ? res.rows.map((row) => {
              const modifiableRow = row;
              if (modifiableRow.created_at) {
                modifiableRow.created_at = this.dateService.dbStringToIso(
                  modifiableRow.created_at
                );
              }
              if (modifiableRow.updated_at) {
                modifiableRow.updated_at = this.dateService.dbStringToIso(
                  modifiableRow.updated_at
                );
              }
              return mapToCamelCase(modifiableRow);
            })
          : (res.rows as T[]);
        this.logger.debug({ message: "query result", data });
        return data;
      }
      return null;
    } catch (e: any) {
      const error = {
        message: e.message,
        stacktrace: e.stacktrace,
        context: "#databaseService query",
        type: "Database Error",
        detail: {
          text,
          params,
        },
      };
      this.logger.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findOne<D, T>(
    text: string,
    params: unknown[],
    mapToCamelCase: (data: D) => T
  ): Promise<T | null> {
    try {
      const res = await this.query<D, T>(text, params, mapToCamelCase);
      if (res) {
        return res[0];
      }
      return null;
    } catch (e: any) {
      throw {
        message: e.message,
        stacktrace: e.stacktrace,
        context: "#databaseService findOne",
        type: "Database Error",
      };
    }
  }
}
