import { addToContainer, container } from "../../container"
import { LoggerService } from "../../logger/logger.service"
import { DatabaseService } from "../database/database.service"



@addToContainer()
export abstract class DataServiceAbstract<DbType, DataType> {
  protected logger = container.get(LoggerService).getLogger(this.constructor.name)
  constructor(){
    this.logger.debug(`${this.constructor.name} instantiated`)
  }  

abstract mapToCamelCase: (data: DbType) => DataType
  abstract db: DatabaseService

  async returnOne(query: string, params: unknown[]): Promise<DataType | null> {
    return await this.db.findOne(query, params, this.mapToCamelCase)
  }

  async returnMany(query: string, params: unknown[]): Promise<DataType[] | null> {
    return await this.db.query(query, params, this.mapToCamelCase)
  }
}