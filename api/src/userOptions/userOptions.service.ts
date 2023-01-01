import { Logger, LoggerService } from '../common/logger.service';
import { DatabaseService } from '../common/database.service';
import { AuthorizationError, NullInputError, NotInDatabaseError } from '../utils/errorsHelpers';
import { addToContainer } from '../container';
import { DataServiceAbstract } from '../common/dataService.abstract';
import { DataResponse } from '../types/DataResponse';
import { IApplicationError } from '../types/ApplicationError';

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
      error: NotInDatabaseError('user_options', userId)
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
      data: null
    }
  }


  protected validateUserOptionsInput(userId: string, input: UserOptionsInput | null, userOptions: UserOptions): { input: UserOptionsInput | null; error: IApplicationError | null } {
    if (userId !== userOptions.userId) {
      this.logger.error({ message: AuthorizationError.message })
      return {
        error: AuthorizationError,
        input: null
      }

    }
    if (input === null) {
      this.logger.error({ message: 'null input #validateUserOptionsInput' })
      return {
        error: NullInputError,
        input: null
      }
    }
    return {
      error: null,
      input
    }
  }
}