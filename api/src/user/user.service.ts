import { addToContainer } from "../container.js";
import { UserRepository } from "./user.repository.js";
import { PlayerService } from "../player/player.service.js";
import { Logger } from "pino";
import { LoggerService } from "../logger/logger.service.js";
import { createError } from "../utils/CreateError.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

@addToContainer()
export class UserService {
  private logger: Logger;

  constructor(
    private ls: LoggerService,
    private userRepo: UserRepository,
    private playerService: PlayerService
  ) {
    this.logger = this.ls.getLogger(UserService.name);
  }

  scrubUser({ id, username }: User) {
    return {
      id,
      username,
    };
  }

  scrubManyUsers(users: User[]) {
    return users.map((user) => {
      return this.scrubUser(user);
    });
  }

  async getOrCreateUserByGoogleId(
    googleId: string,
    email: string,
    username: string
  ) {
    try {
      return await this.getByGoogleId(googleId);
    } catch (e) {
      this.logger.error(e);

      return await this.register({
        googleId,
        email,
        username,
        appleId: null,
        githubId: null,
      });
    }
  }

  async getByGoogleId(googleId: string) {
    const res = await this.userRepo.getUserByGoogleId(googleId);
    if (res) {
      return res;
    }
    throw createError({
      message: "User not found",
      type: ErrorTypes.USER_ERROR,
      context: "UserService",
      status: HTTPCodes.NOT_FOUND,
    });
  }

  async getById(id: string) {
    return await this.userRepo.getUserById(id);
  }

  async getByEmail(email: string) {
    const res = await this.userRepo.getUserByEmail(email);
    if (res) {
      return this.scrubUser(res);
    }
    return null;
  }

  async register(registerUser: RegisterUser) {
    try {
      const user = await this.userRepo.createUser(registerUser);
      if (user) {
        const adjustedName = user.username || `user-${user.id}`;
        await this.playerService.createPlayerForUser(user.id, adjustedName);
        return user;
      }
      return null;
    } catch (e) {
      const error = createError({
        message: "Error registering user",
        type: ErrorTypes.USER_ERROR,
        stacktrace: e.stacktrace,
        context: "UserService",
        detail: {
          registerUser,
        },
        status: HTTPCodes.SERVER_ERROR,
      });
      this.logger.error(error);
      throw error;
    }
  }

  async updateProfile(username: string): Promise<{
    user: User | null;
    scrubbedUser: ScrubbedUser | null;
  }> {
    const user = await this.userRepo.updateUserProfile(username);
    return {
      user,
      scrubbedUser: user ? this.scrubUser(user) : null,
    };
  }
}
