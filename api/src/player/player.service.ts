import { addToContainer } from "../container.js";
import { PlayerRepository } from "./player.repository.js";
import { GroupWsService } from "../group/groupWs.service.js";
import { Logger } from "pino";
import { LoggerService } from "../logger/logger.service.js";
import { createError } from "../utils/CreateError.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

@addToContainer()
export class PlayerService {
  private logger: Logger;
  constructor(
    private playerRepo: PlayerRepository,
    private ls: LoggerService,
    private groupWs: GroupWsService
  ) {
    this.logger = this.ls.getLogger(PlayerService.name);
  }

  async getPlayersByGroupId(groupId: string) {
    try {
      const res = await this.playerRepo.getPlayersByGroupId(groupId);
      if (res && res.length) {
        return res;
      }
      return [];
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }
  async getPlayerById(playerId: string) {
    return await this.playerRepo.getPlayerById(playerId);
  }

  async getGroupPlayersWherePlayerIsIn(groupId: string, userId: string) {
    const res = await this.getPlayersByGroupId(groupId);
    this.logger.info(res, userId);
  }

  async getPlayerByUserId(userId: string) {
    return await this.playerRepo.getPlayerByUserId(userId);
  }

  async getGroupPlayer(userId: string, groupId: string) {
    return await this.playerRepo.getUserPlayerFromGroup(userId, groupId);
  }

  async createPlayer(player: ICreatePlayer) {
    return await this.playerRepo.createPlayer(player);
  }

  async createPlayerForUser(userId: string, username: string) {
    return await this.createPlayer({
      userId,
      name: username,
      groupId: null,
      tank: false,
      healer: false,
      dps: false,
      inTheRoll: false,
      locked: false,
    });
  }

  async updatePlayerIsValid(input: IUpdatePlayer, userId: string) {
    const playerRes = await this.getPlayerById(input.id);
    let valid = false;

    if (input.groupId !== null) {
      valid = input.groupId === playerRes?.groupId;
    }

    if (input.userId !== null) {
      const userIdsMatch = input.userId === playerRes?.userId;
      const userIsValid = userId === playerRes?.userId;
      valid = userIdsMatch && userIsValid;
    }
    return valid;
  }

  async updateUserPlayer(input: IUpdatePlayer, userId: string) {
    const valid = await this.updatePlayerIsValid(input, userId);
    if (!valid) {
      throw createError({
        message: "unable to update player",
        type: ErrorTypes.PLAYER_ERROR,
        context: this.updateUserPlayer.name,
        detail: "player is not valid",
        status: HTTPCodes.BAD_REQUEST,
      });
    }
    return await this.updatePlayer(input);
  }

  async updatePlayer(input: IUpdatePlayer) {
    const res = await this.playerRepo.updatePlayer(input);
    if (res && res.groupId !== null) {
      this.groupWs.playerUpdated(res);
    }
    return res;
  }

  async deletePlayer(id: string) {
    return await this.playerRepo.deletePlayer(id);
  }
}
