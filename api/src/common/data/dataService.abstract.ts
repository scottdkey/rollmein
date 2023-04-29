import { addToContainer } from "../../container"
import { DataResponse } from "../../types/DataResponse"
import { DatabaseService } from "../database/database.service"



@addToContainer()
export abstract class DataServiceAbstract<DbType, DataType> {
  abstract mapToCamelCase: (data: DbType) => DataType
  abstract db: DatabaseService

  async returnOne(query: string, params: unknown[]): Promise<DataResponse<DataType>> {
    try {
      return await this.db.findOne(query, params, this.mapToCamelCase)
    } catch (e) {
      console.error(e)
      return {
        data: null,
        success: false,
        error: e
      }
    }
  }

  async returnMany(query: string, params: unknown[]): Promise<DataResponse<DataType[]>> {
    try {
      return await this.db.query(query, params, this.mapToCamelCase)
    } catch (e) {
      console.error(e)
      return {
        data: null,
        success: false,
        error: e
      }
    }
  }
}