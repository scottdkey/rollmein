import { ErrorTypes } from "../../../shared/types/ErrorCodes.enum";
import { ErrorMessages } from "../../../shared/types/ErrorTypes.enum";
import { RedisKeys } from "../../../shared/types/redisKeys.enum";
import { addToContainer } from "../container";
import { RedisService } from "../redis/redis.service";
import { createError } from "../utils/CreateError";

@addToContainer()
export class RollRepository {
  constructor(private redisService: RedisService) { }

  private repoError = ({ message, detail, context }: { message: string, context: string, detail?: string }) => {
    createError({
      message,
      type: ErrorTypes.ROLL_ERROR,
      context,
      detail
    })
  }

  getRollFromCache = async (groupId: string) => {
    return await this.redisService.get<RollReturn>(RedisKeys.GROUP, `roll-${groupId}`)
  }

  setRollToCache = async (groupId: string, roll: RollReturn) => {
    return await this.redisService.setWithRetry<RollReturn>(RedisKeys.GROUP, `roll-${groupId}`, roll, 4)
  }

  getRoll = async (groupId: string): Promise<RollReturn> => {
    const roll = await this.getRollFromCache(groupId)
    if (!roll) {
      const newRoll = await this.setRollToCache(groupId, {
        started: false,
        currentRoll: null,
        remainingPlayers: [],
        previousRolls: [],
        lastCompletedTimestamp: null
      })
      if (newRoll) {
        return newRoll
      }
    }
    if (roll) {
      return roll
    }

    throw this.repoError({
      message: ErrorMessages.ROLL_ERROR,
      context: this.getRoll.name,
      detail: "no roll found"
    })
  }

}