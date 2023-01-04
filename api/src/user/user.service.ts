import { Logger, LoggerService } from '../common/logger.service';
import { ApplicationError } from '../utils/errorsHelpers';
import { addToContainer } from "../container";
import { UserRepository } from './user.repository';
import { User, RegisterUser } from '../types/user';
import { PlayerService } from '../player/player.service';

@addToContainer()
export class UserService {
  private logger: Logger
  userService: any;

  constructor(private ls: LoggerService, private userRepo: UserRepository, private playerService: PlayerService) {
    this.logger = this.ls.getLogger(UserService.name)
  }

  scrubUser({ id, username }: User) {
    return {
      id,
      username
    }
  }

  scrubManyUsers(users: User[]) {
    return users.map(user => {
      return this.scrubUser(user)
    })
  }

  async getOrCreateUserByGoogleId(googleId: string, email: string, username: string) {
    try {
      const user = await this.getByGoogleId(googleId)
      if (user.success === false) {
        const registerRes = await this.register({ googleId, email, username, appleId: null, githubId: null })
        return registerRes.data

      }
      if (user.success === true) {
        return user.data
      }
      return null
    } catch (e) {
      const message = 'error #findOrCreateUserGoogleId'
      this.logError(message, e)
      throw ApplicationError(message)
    }
  }

  async getByGoogleId(googleId: string) {
    return await this.userRepo.getUserByGoogleId(googleId)
  }

  async getById(id: string) {
    return await this.userRepo.getUserById(id)
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.getUserByEmail(email)
    if (user.success && user.data) {
      return {
        ...user,
        data: this.scrubUser(user.data)
      }
    }
    return user
  }


  async register(registerUser: RegisterUser) {
    try {
      const user = await this.userRepo.createUser(registerUser)
      const userId = user?.data?.id as string
      const username = user?.data?.username as string
      await this.playerService.createPlayerForUser(userId, username)
      return user
    } catch (e) {
      const message = "error creating user"
      this.logError(message, e)
      throw ApplicationError(message)

    }
  }

  async updateProfile(username: string) {
    const user = await this.userRepo.updateUserProfile(username)
    if (user.success && user.data) {
      return {
        ...user,
        data: this.scrubUser(user.data),
        user: user.data
      }
    }
    return {
      ...user,
      user: null
    }
  }
  logError(message: string, e: any) {
    this.logger.error({
      message,
      error: e.message,
      stacktrace: e.stacktrace
    })
    throw ApplicationError(message)
  }



}
