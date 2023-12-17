import { addToContainer, container } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { DatabaseService } from "../database/database.service.js";

@addToContainer()
export abstract class DataServiceAbstract<DbType, DataType> {
  protected logger = container
    .get(LoggerService)
    .getLogger(this.constructor.name);

  abstract mapToCamelCase: (data: DbType) => DataType;
  abstract db: DatabaseService;

  async returnOne(query: string, params: unknown[]): Promise<DataType | null> {
    return await this.db.findOne(query, params, this.mapToCamelCase);
  }

  async returnMany(
    query: string,
    params: unknown[]
  ): Promise<DataType[] | null> {
    return await this.db.query(query, params, this.mapToCamelCase);
  }
}
