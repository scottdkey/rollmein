import { ApplicationError } from '../utils/errorsHelpers';
import { addToContainer } from '../container';
import { PlayerRepository } from './player.repository';
import { Logger, LoggerService } from '../common/logger.service';

@addToContainer()
export class PlayerService {
  private logger: Logger
  constructor(private playerRepo: PlayerRepository, private ls: LoggerService) {
    this.logger = this.ls.getLogger(PlayerService.name)
  }

  async getPlayersByGroupId(groupId: string) {
    return await this.playerRepo.getPlayersByGroupId(groupId)
  }
  async getPlayerById(playerId: string) {
    try {
      const playerRes = await this.playerRepo.getPlayerById(playerId)
      if (playerRes.success) {
        return playerRes.data
      }
      throw playerRes.error
    } catch (e) {
      throw e.message
    }
  }
  async getPlayerByUserId(userId: string) {
    try {
      const res = await this.playerRepo.getPlayerByUserId(userId)
      if (res.success) {
        return res.data
      }
      if (res.error) {
        this.logger.error({
          ...res.error,
          message: "unable to get player by userId",

        })
      }
      return
    } catch (e) {
      throw e.message
    }
  }

  async createPlayer(player: ICreatePlayer) {
    try {
      const res = await this.playerRepo.createPlayer(player)
      if (res.success) {
        return res.data
      }
      throw res.error
    } catch (e) {
      throw e.message
    }
  }

  async createPlayerForUser(userId: string, username: string) {
    try {
      return await this.createPlayer({
        userId,
        name: username,
        groupId: null,
        tank: false,
        healer: false,
        dps: false,
        inTheRoll: false,
        locked: false
      })
    } catch (e) {
      this.logger.error({
        message: "Unable to create player",
        error: e.message,
        stacktrace: e.stacktrace
      })
      throw ApplicationError("Unable to create player")
    }

  }

  async updatePlayerIsValid(input: IUpdatePlayer, userId: string) {
    const playerRes = await this.getPlayerById(input.id)
    let valid = false

    if (input.groupId !== null) {
      valid = input.groupId === playerRes?.groupId
    }

    if (input.userId !== null) {
      const userIdsMatch = input.userId === playerRes?.userId
      const userIsValid = userId === playerRes?.userId
      valid = userIdsMatch && userIsValid
    }
    return valid
  }

  async updatePlayer(input: IUpdatePlayer, userId: string) {
    const valid = await this.updatePlayerIsValid(input, userId)
    if (valid) {
      const res = await this.playerRepo.updatePlayer(input)
      if (res.success) {
        return res.data
      }
      throw res.error?.message
    }
    throw ApplicationError("update player error -- request body not valid")
  }

  async deletePlayer(id: string): Promise<DataResponse<IDeletePlayerResponse>> {
    return await this.playerRepo.deletePlayer(id)
  }

}

