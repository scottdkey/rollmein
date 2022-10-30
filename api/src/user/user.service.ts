import { Logger, LoggerService } from '../common/logger.service';
import { ApplicationError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import { DataResponse } from '../types/DataResponse';
import { RegisterUser, User } from '../types/user';
import { UserRepository } from './user.repository';

@addToContainer()
export class UserService {
  private logger: Logger

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
