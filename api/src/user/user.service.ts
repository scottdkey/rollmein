import { addToContainer } from "../container";
import { UserRepository } from './user.repository';
import { PlayerService } from '../player/player.service';
import { Logger } from 'pino';
import { LoggerService } from '../logger/logger.service';
import { createError } from "../utils/CreateError";
import { ErrorTypes } from "../../../shared/types/ErrorCodes.enum";

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

      return await this.getByGoogleId(googleId)

    } catch (e) {

      this.logger.error(e)

      return await this.register({ googleId, email, username, appleId: null, githubId: null })
    }
  }

  async getByGoogleId(googleId: string) {
    return await this.userRepo.getUserByGoogleId(googleId)
  }

  async getById(id: string) {
    return await this.userRepo.getUserById(id)
  }

  async getByEmail(email: string) {
    const res = await this.userRepo.getUserByEmail(email)
    if (res) {
      return this.scrubUser(res)
    }
    return null
  }


  async register(registerUser: RegisterUser) {
    try {
      const user = await this.userRepo.createUser(registerUser)
      if (user) {
        const adjustedName = user.username || `user-${user.id}`
        await this.playerService.createPlayerForUser(user.id, adjustedName)
        return user
      }
      return null
    } catch (e) {
      const error = createError({
        message: "Error registering user",
        type: ErrorTypes.USER_ERROR,
        stacktrace: e.stacktrace,
        context: "UserService",
        detail: {
          registerUser
        }
      })
      this.logger.error(error)
      throw error
    }
  }

  async updateProfile(username: string): Promise<{
    user: User | null,
    scrubbedUser: ScrubbedUser | null
  }> {
    const user = await this.userRepo.updateUserProfile(username)
    return {
      user,
      scrubbedUser: user ? this.scrubUser(user) : null
    }
  }
  logError(message: string, e: any, context: string = "UserService") {
    const error = createError({
      message,
      type: ErrorTypes.USER_ERROR,
      stacktrace: e.stacktrace,
      context
    })
    this.logger.error(error)
    throw error
  }



}
