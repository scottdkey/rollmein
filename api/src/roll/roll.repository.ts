import { Logger } from "pino";
import { RedisKeys } from "../types/redisKeys.enum.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { RedisService } from "../redis/redis.service.js";
import { createError } from "../utils/CreateError.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

@addToContainer()
export class RollRepository {
  private logger: Logger;
  constructor(private redisService: RedisService, private ls: LoggerService) {
    this.logger = this.ls.getLogger("RollRepository");
  }

  getRollFromCache = async (groupId: string) => {
    return await this.redisService.get<RollReturn>(
      RedisKeys.GROUP,
      `roll-${groupId}`
    );
  };

  setRollToCache = async (groupId: string, roll: RollReturn) => {
    return await this.redisService.setWithRetry<RollReturn>(
      RedisKeys.GROUP,
      `roll-${groupId}`,
      roll,
      4
    );
  };

  getRoll = async (groupId: string): Promise<RollReturn | null> => {
    try {
      const roll = await this.getRollFromCache(groupId);
      if (!roll) {
        const newRoll = await this.setRollToCache(groupId, {
          started: false,
          currentRoll: null,
          remainingPlayers: [],
          previousRolls: [],
          lastCompletedTimestamp: null,
        });
        if (newRoll) {
          return newRoll;
        }
      }
      if (roll) {
        return roll;
      }
      throw createError({
        type: ErrorTypes.ROLL_ERROR,
        message: "unable to getRoll",
        context: "getRoll",
        status: HTTPCodes.SERVER_ERROR,
        detail: { groupId },
      });
    } catch (e) {
      this.logger.error(e, "unable to get roll");
      throw createError({
        type: ErrorTypes.ROLL_ERROR,
        message: e.message,
        context: "getRoll",
        status: HTTPCodes.SERVER_ERROR,
        stacktrace: e.stacktrace,
        detail: { groupId },
      });
    }
  };
}
