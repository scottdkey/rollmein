import { addToContainer } from "../../container"
import { DatabaseService } from "../database/database.service"



@addToContainer()
export abstract class DataServiceAbstract<DbType, DataType> {
  abstract mapToCamelCase: (data: DbType) => DataType
  abstract db: DatabaseService

  async returnOne(query: string, params: unknown[]): Promise<DataType | null> {
    return await this.db.findOne(query, params, this.mapToCamelCase)
  }

  async returnMany(query: string, params: unknown[]): Promise<DataType[] | null> {
    return await this.db.query(query, params, this.mapToCamelCase)
  }
}