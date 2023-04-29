import { addToContainer } from '../container';
import { Logger } from 'pino';
import { DataServiceAbstract } from '../common/data/dataService.abstract';
import { DatabaseService } from '../common/database/database.service';
import { LoggerService } from '../logger/logger.service';
import { DbUserOptions, UserOptions, UserOptionsInput } from '../types/UserOptions';
import { ErrorMessages } from '../utils/ErrorTypes.enum';
import { DataResponse } from '../types/DataResponse';

@addToContainer()
export class UserOptionsService extends DataServiceAbstract<DbUserOptions, UserOptions>{
  db: DatabaseService
  logger: Logger
  constructor(private database: DatabaseService, private ls: LoggerService) {
    super()
    this.db = this.database
    this.logger = this.ls.getLogger("UserOptionsService")
  }

  mapToCamelCase = ({ user_id, theme, created_at, updated_at }: DbUserOptions): UserOptions => {
    return {
      userId: user_id,
      theme,
      createdAt: created_at,
      updatedAt: updated_at
    }
  }

  async createOptions(userId: string): Promise<DataResponse<UserOptions>> {
    const query = `INSERT INTO user_options (user_id) VALUES ($1) RETURNING *`
    const params = [userId]
    return this.returnOne(query, params)
  }
  async getUserOptions(userId: string): Promise<DataResponse<UserOptions>> {
    const query = 'SELECT * FROM user_options WHERE user_id=$1'
    const params = [userId]
    return await this.returnOne(query, params)
  }
  async updateOptions(userId: string, requestInput: UserOptionsInput): Promise<DataResponse<UserOptions>> {
    const uoRes = await this.getUserOptions(userId)
    if (uoRes.data) {
      const { input, error } = this.validateUserOptionsInput(userId, requestInput, uoRes.data)
      if (input) {
        const query = `UPDATE user_options SET theme=$1 WHERE user_id=$2 RETURNING *`
        const params = [input.theme, userId]
        return await this.returnOne(query, params)
      }
      if (error) {
        return {
          data: null,
          success: false,
          error
        }
      }
    }
    return {
      data: null,
      success: false,
      error: `unable to update user options for user ${userId}`
    }
  }
  async deleteOptions(userId: string): Promise<DataResponse<boolean | null>> {
    const res = await this.returnOne("DELETE FROM user_options WHERE user_id=$1", [userId])
    if (res.success) {
      return {
        ...res,
        data: null
      }
    }
    return {
      ...res,
      data: null,
      error: `unable to delete user options for user ${userId}`
    }
  }


  protected validateUserOptionsInput(userId: string, input: UserOptionsInput | null, userOptions: UserOptions): { input: UserOptionsInput | null; error: string | null } {
    if (userId !== userOptions.userId) {
      const error = { message: ErrorMessages.AuthorizationError, context: 'userId does not match userOptions.userId' }
      this.logger.error(error)
      return {
        error: error.context,
        input: null
      }

    }
    if (input === null) {
      this.logger.error({ message: 'null input #validateUserOptionsInput' })
      return {
        error: ErrorMessages.NullInputError,
        input: null
      }
    }
    return {
      error: null,
      input
    }
  }
}