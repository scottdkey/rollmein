import { Logger, LoggerService } from '../common/logger.service';
import { ApplicationError, UnknownProblemError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import { DataResponse } from '../types/DataResponse';
import { RegisterUser, User } from '../types/user';
import { UserRepository } from './user.repository';
import { ValidateRequestBody } from '../auth/auth.router';
import { IFirebaseInfo } from '../types/context';

@addToContainer()
export class UserService {
  private logger: Logger
  userService: any;

  constructor(private ls: LoggerService, private userRepo: UserRepository) {
    this.logger = this.ls.getLogger(UserService.name)
  }

  scrubResponse({ id, username }: User) {
    return {
      id,
      username
    }
  }

  scrubManyResponse(users: User[]) {
    return users.map(user => {
      return this.scrubResponse(user)
    })
  }

  async getByFirebaseId(firebaseId: string) {
    return await this.userRepo.getUserByFirebaseId(firebaseId)
  }

  async ensureUserExists(body: ValidateRequestBody, payload: IFirebaseInfo): Promise<DataResponse<User>> {
    try {
      let returnError: AppError = UnknownProblemError(new Error('unknown problem ocurred in #ensureUserExists'))
      const user = await this.getByFirebaseId(payload.firebaseId)

      if (user.success) {
        return user
      }
      if (user.error) {
        returnError = user.error
      }
      if (!user.data && !user.success) {
        const registerUser: RegisterUser = {
          username: null,
          email: payload.email,
          googleId: payload.googleId || null,
          appleId: payload.appleId || null,
          firebaseId: payload.firebaseId,
          refreshToken: body.refreshToken

        }
        const registeredUser = await this.register(registerUser)
        if (registeredUser.success) {
          return registeredUser
        }
        if (!registeredUser.success && registeredUser.error) {
          returnError = registeredUser.error
        }
      }
      return {
        data: null,
        success: false,
        error: returnError
      }
    } catch (e) {
      this.logger.error({ message: "error occurred on #ensureUserExists", ...e })
      return {
        data: null,
        success: false,
        error: e
      }
    }
  }

  async register(registerUser: RegisterUser): Promise<DataResponse<User>> {
    try {
      const userRes = await this.userRepo.createUser(registerUser)
      const googleId = registerUser.googleId
      const appleId = registerUser.appleId
      if (userRes.data && googleId) {
        const res = await this.userRepo.addGoogleId(googleId, userRes.data.id)
        return res
      }
      if (userRes.data && appleId) {
        return await this.userRepo.addAppleId(appleId, userRes.data.id)
      }
      return userRes
    }
    catch (e) {
      this.logger.error(ApplicationError(e.message))
      return {
        data: null,
        success: false,
        error: ApplicationError(e.message)
      }
    }
  }

  async updateProfile(username: string) {
    return await this.userRepo.updateUserProfile(username)
  }



}
