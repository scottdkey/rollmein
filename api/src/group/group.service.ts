import { Logger } from "pino";
import { ICreateGroup, IGroup, IUpdateGroup } from "../types/Group.js";
import { addToContainer } from "../container.js";
import { LoggerService } from "../logger/logger.service.js";
import { PlayerService } from "../player/player.service.js";
import { createError } from "../utils/CreateError.js";
import { GroupRepository } from "./group.repository.js";
import { GroupWsService } from "./groupWs.service.js";
import { ErrorTypes } from "../types/ErrorCodes.enum.js";
import { HTTPCodes } from "../types/HttpCodes.enum.js";

@addToContainer()
export class GroupService {
  private logger: Logger;
  constructor(
    private groupRepo: GroupRepository,
    private ls: LoggerService,
    private playerService: PlayerService,
    private groupWs: GroupWsService
  ) {
    this.logger = this.ls.getLogger(GroupService.name);
  }

  async getGroup(groupId: string, userId?: string) {
    const res = await this.groupRepo.getGroupById(groupId);

    let auth = false;
    if (res && userId) {
      auth = await this.checkIfAuthorized(res, userId);
    }
    return {
      auth,
      group: res,
    };
  }

  async getGroups() {
    const res = await this.groupRepo.getGroups();
    if (res) {
      const sorted = res.sort((a: IGroup, b: IGroup) => {
        const date1 = new Date(a.createdAt).getMilliseconds();

        const date2 = new Date(b.createdAt).getMilliseconds();
        return date1 - date2;
      });
      return sorted;
    }
    return null;
  }

  async getGroupsByUserId(userId: string) {
    return await this.groupRepo.getGroupsByUserId(userId);
  }

  async createGroup(userId: string, createParams: ICreateGroup) {
    return await this.groupRepo.createGroup(userId, createParams);
  }

  async updateActiveGroup(group: IGroup) {
    const res = await this.groupRepo.updateGroup(group);
    await this.groupWs.groupUpdated(group);
    return res;
  }

  async updateGroup(
    userId: string,
    updateValueInput: IUpdateGroup
  ): Promise<IGroup | null> {
    try {
      const group = await this.setupUpdateGeneric(updateValueInput.id, userId);

      if (group) {
        group.relations.members = this.setFromStringArray(
          group.relations.members,
          updateValueInput.memberId
        );

        group.relations.players = this.setFromStringArray(
          group.relations.players,
          updateValueInput.playerId
        );

        group.name = updateValueInput.name ? updateValueInput.name : group.name;

        group.rollType = updateValueInput.rollType
          ? updateValueInput.rollType
          : group.rollType;

        group.lockAfterOut =
          updateValueInput.lockAfterOut !== undefined
            ? updateValueInput.lockAfterOut
            : group.lockAfterOut;

        group.membersCanUpdate =
          updateValueInput.membersCanUpdate !== undefined
            ? updateValueInput.membersCanUpdate
            : group.membersCanUpdate;
        const res = await this.groupRepo.updateGroup(group);
        this.groupWs.groupUpdated(group);

        return res;
      }
      return null;
    } catch (e) {
      this.logger.error(e);
      throw createError({
        message: "Error updating group",
        type: ErrorTypes.GROUP_ERROR,
        context: "GroupService.updateGroup",
        status: HTTPCodes.SERVER_ERROR,
      });
    }
  }

  setFromStringArray(array: string[], value?: string) {
    return value ? [...new Set([...array, value])] : array;
  }

  async setupUpdateGeneric(groupId: string, userId: string) {
    const group = await this.groupRepo.getGroupById(groupId);
    if (group) {
      this.checkIfAuthorized(group, userId);
      return group;
    } else {
      return null;
    }
  }

  async addPlayer(groupId: string, userId: string, player: IPlayer) {
    const group = await this.setupUpdateGeneric(groupId, userId);
    if (group) {
      group.relations.players = this.setFromStringArray(
        group.relations.players,
        player.id
      );
      this.groupWs.playerWasAdded(player);
      return await this.updateActiveGroup(group);
    }
    return null;
  }

  async createGroupPlayer(
    input: ICreatePlayer,
    groupId: string,
    userId: string
  ) {
    const group = await this.getGroup(groupId, userId);
    if (group.auth === true && group.group) {
      const nulledUserInput = { ...input, userId: null };
      const player = await this.playerService.createPlayer(nulledUserInput);
      if (player) {
        await this.addPlayer(groupId, userId, player);
        return player;
      }
    }
    return null;
  }

  async removePlayer(groupId: string, userId: string, playerId: string) {
    const group = await this.setupUpdateGeneric(groupId, userId);
    if (group) {
      group.relations.players = group.relations.players.filter(
        (value: string) => value === playerId
      );
      return await this.updateActiveGroup(group);
    }
    return null;
  }

  async addMember(groupId: string, userId: string, player: IPlayer) {
    try {
      const group = await this.setupUpdateGeneric(groupId, userId);

      const existingPlayer = await this.playerService.getGroupPlayer(
        userId,
        groupId
      );

      if (existingPlayer && existingPlayer.id) {
        return group;
      }

      this.groupWs.playerJoinedGroup(player);

      if (group) {
        return await this.updateActiveGroup(group);
      }

      if (!group) {
        const groupPlayer = await this.playerService.createPlayer({
          groupId,
          userId,
          name: player.name,
          tank: player.tank,
          healer: player.healer,
          dps: player.dps,
          locked: false,
          inTheRoll: false,
        });
        const group = await this.setupUpdateGeneric(groupId, userId);
        if (group && groupPlayer) {
          const newGroup = await this.pushPlayerToGroup(group, groupPlayer);
          const res = await this.updateActiveGroup(newGroup);
          this.groupWs.playerJoinedGroup(groupPlayer);
          return res;
        }
      }
      return null;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  private pushPlayerToGroup(group: IGroup, player: IPlayer) {
    const newMembers = this.setFromStringArray(
      group.relations.members,
      player.userId ? player.userId : undefined
    );
    const newPlayers = this.setFromStringArray(
      group.relations.players,
      player.id
    );

    group.relations.members = newMembers;
    group.relations.players = newPlayers;
    return {
      ...group,
      relations: {
        members: newMembers,
        players: newPlayers,
      },
    };
  }

  async removeMember(group: IGroup, userId: string) {
    const setupGroup = await this.setupUpdateGeneric(group.id, userId);
    const player = await this.playerService.getGroupPlayer(userId, group.id);

    if (player && setupGroup) {
      group.relations.members = setupGroup.relations.members.filter(
        (value: string) => value !== userId
      );
      group.relations.players = setupGroup.relations.players.filter(
        (value: string) => value !== player.id
      );
      await this.playerService.deletePlayer(player.id);
      await this.groupWs.playerLeftGroup(player);
    }

    await this.updateActiveGroup(group);
  }

  async deleteGroup(id: string, userId: string): Promise<boolean> {
    const groupQuery = await this.groupRepo.getGroupById(id);
    if (groupQuery) {
      const authorized = this.checkIfAuthorized(groupQuery, userId);
      if (!authorized) {
        throw createError({
          message: "Not authorized",
          type: ErrorTypes.APP_ERROR,
          context: "deleteGroup",
          status: HTTPCodes.NOT_AUTHORIZED,
        });
      }
      return await this.groupRepo.deleteByUserId(id, userId);
    } else {
      throw createError({
        message: "Group not found",
        type: ErrorTypes.APP_ERROR,
        context: "deleteGroup",
        status: HTTPCodes.NOT_FOUND,
      });
    }
  }

  checkIfAuthorized(group: IGroup, userIdFromRequest: string) {
    const groupOwner = group.userId === userIdFromRequest;

    const inGroupMembers =
      group.relations.members.length > 0 &&
      group.relations.members.includes(userIdFromRequest);
    if (!group.membersCanUpdate) {
      return groupOwner;
    }
    return groupOwner || inGroupMembers;
  }

  async userJoinGroup(groupId: string, userId: string) {
    const player = await this.playerService.getPlayerByUserId(userId);
    const groupRes = await this.getGroup(groupId, userId);

    if (groupRes.group && groupRes.auth && player) {
      const updatedGroup = await this.addMember(groupId, userId, player);
      return updatedGroup;
    }
    if (!player) {
      throw createError({
        message: "No User Player Found",
        type: ErrorTypes.PLAYER_ERROR,
        context: "userJoinGroup",
        status: HTTPCodes.BAD_REQUEST,
        detail: {
          groupId,
        },
      });
    }
    throw createError({
      message: "Not authorized",
      type: ErrorTypes.APP_ERROR,
      context: "userJoinGroup",
      status: HTTPCodes.NOT_AUTHORIZED,
      detail: {
        ...groupRes,
      },
    });
  }
}
