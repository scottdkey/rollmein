import { Logger } from 'pino';
import { ErrorTypes } from '../../../shared/types/ErrorCodes.enum';
import { DbUserOptions, UserOptions, UserOptionsInput } from '../../../shared/types/UserOptions';
import { DataServiceAbstract } from '../common/data/dataService.abstract';
import { DatabaseService } from '../common/database/database.service';
import { addToContainer } from '../container';
import { LoggerService } from '../logger/logger.service';
import { createError } from '../utils/CreateError';

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

  async createOptions(userId: string): Promise<UserOptions | null> {
    const query = `INSERT INTO user_options (user_id) VALUES ($1) RETURNING *`
    const params = [userId]
    return this.returnOne(query, params)
  }

  async getUserOptions(userId: string): Promise<UserOptions | null> {
    const query = 'SELECT * FROM user_options WHERE user_id=$1'
    const params = [userId]
    return await this.returnOne(query, params)
  }

  async updateOptions(userId: string, requestInput: UserOptionsInput): Promise<UserOptions | null> {
    const uoRes = await this.getUserOptions(userId)
    if (uoRes) {
      const input = this.validateUserOptionsInput(userId, requestInput, uoRes)

      const query = `UPDATE user_options SET theme=$1 WHERE user_id=$2 RETURNING *`
      const params = [input.theme, userId]
      return await this.returnOne(query, params)
    }
    return null
  }

  async deleteOptions(userId: string): Promise<boolean> {
    await this.returnOne("DELETE FROM user_options WHERE user_id=$1", [userId])
    return true

  }


  protected validateUserOptionsInput(userId: string, input: UserOptionsInput | null, userOptions: UserOptions): UserOptionsInput {
    if (userId !== userOptions.userId) {
      const error = createError({
        message: 'userId does not match userOptions.userId',
        context: 'validateUserOptionsInput',
        type: ErrorTypes.AUTH_ERROR,
      })
      this.logger.error(error)
      throw error

    }
    if (input === null) {
      const error = createError({
        message: 'null input',
        context: 'validateUserOptionsInput',
        type: ErrorTypes.INPUT_ERROR,
      })
      this.logger.error(error)

      throw error
    }
    return input
  }
}