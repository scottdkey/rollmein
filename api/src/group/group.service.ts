import { Logger, LoggerService } from "../common/logger.service";
import { addToContainer } from "../container";
import { ApplicationErrorResponse, AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { GroupRepository } from './group.repository';
import { HTTPCodes } from "../types/HttpCodes.enum";
import { ICreateGroup, IGroup, IGroupUpdate } from "../types/Group";
import { PlayerService } from "../player/player.service";
import { GroupWsService } from "./groupWs.service";
import { RollService } from "../roll/roll.service";

@addToContainer()
export class GroupService {
  private logger: Logger
  constructor(private groupRepo: GroupRepository, private ls: LoggerService, private playerService: PlayerService, private groupWs: GroupWsService, private rollService: RollService) {
    this.logger = this.ls.getLogger(GroupService.name)
  }

  async getGroup(groupId: string, userId?: string) {
    const res = await this.groupRepo.getGroupById(groupId)
    let auth: boolean = false
    if (res.data && userId) {
      auth = await this.checkIfAuthorized(res.data, userId)
    }
    return {
      auth,
      group: res.data
    }

  }

  async getGroups() {
    const res = await this.groupRepo.getGroups()
    this.logger.info({ message: "groups res", res })
    if (res.data && res.data.length > 0) {
      return {
        ...res,
        data: res.data.sort((a: any, b: any) => {
          const date1 = new Date(a.createdAt).getMilliseconds()

          const date2 = new Date(b.createdAt).getMilliseconds()
          return date1 - date2
        })
      }
    }

    return res
  }

  async getGroupsByUserId(userId: string) {
    return await this.groupRepo.getGroupsByUserId(userId)
  }

  async createGroup(userId: string, createParams: ICreateGroup) {
    try {
      const res = await this.groupRepo.createGroup(userId, createParams)
      if (res.data) {

      }
      if (res.data || res.error) {
        return res
      }
      return ApplicationErrorResponse(new Error("createGroup Error"))

    } catch (e) {
      this.logger.error({ message: "create group error", error: e })
      return ApplicationErrorResponse(new Error(e.message))
    }
  }

  async getGroupPlayerCounts(groupId: string) {
    const group = await this.getGroup(groupId)
    const players = await this.playerService.getPlayersByGroupId(groupId)
    if (players.data && group.group?.rollType) {

      const res = this.rollService.playerCounts(players.data, group.group.rollType)
      if (res.locked > 5) {
        this.groupWs.tooManyLocked(groupId, res.locked)
      }
      return res
    }
    return null

  }


  async updateActiveGroup(group: IGroup) {
    const res = await this.groupRepo.updateGroup(group)
    const counts = await this.getGroupPlayerCounts(group.id)
    if (counts) {
      await this.groupWs.updateGroupCount(group.id, counts)
    }
    await this.groupWs.groupUpdated(group)
    return res
  }
  async updateGroup(
    userId: string,
    updateValueInput: IGroupUpdate): Promise<DataResponse<IGroup>> {

    const groupQuery = await this.setupUpdateGeneric(updateValueInput.id, userId)

    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data

      group.relations.members = this.setFromStringArray(group.relations.members, updateValueInput.memberId)

      group.relations.players = this.setFromStringArray(group.relations.players, updateValueInput.playerId)

      group.name = updateValueInput.name ? updateValueInput.name : group.name

      group.rollType = updateValueInput.rollType ? updateValueInput.rollType : group.rollType

      group.lockAfterOut = updateValueInput.lockAfterOut !== undefined ? updateValueInput.lockAfterOut : group.lockAfterOut

      group.membersCanUpdate = updateValueInput.membersCanUpdate !== undefined ? updateValueInput.membersCanUpdate : group.membersCanUpdate
      const res = await this.groupRepo.updateGroup(group)
      this.groupWs.groupUpdated(group)
      return res
    }
    return groupQuery
  }

  setFromStringArray(array: string[], value?: string) {
    return value ? [...new Set([...array, value])] : array
  }

  async setupUpdateGeneric(groupId: string, userId: string) {
    const groupQuery = await this.groupRepo.getGroupById(groupId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      const authorized = this.checkIfAuthorized(group, userId)
      if (!authorized) {
        return AuthorizationErrorResponse
      }
      return groupQuery
    }
    return ApplicationErrorResponse({ message: "#addPlayer error", info: "no group found with id" })
  }

  async addPlayer(groupId: string, userId: string, player: IPlayer) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.players = this.setFromStringArray(group.relations.players, player.id)
      this.groupWs.playerWasAdded(player)
      return await this.updateActiveGroup(group)
    }
    return groupQuery
  }

  async createGroupPlayer(input: ICreatePlayer, groupId: string, userId: string) {
    const group = await this.getGroup(groupId, userId)
    if (group.auth && group) {
      const nulledUserInput = { ...input, userId: null }
      const player = await this.playerService.createPlayer(nulledUserInput)
      if (player) {
        await this.addPlayer(groupId, userId, player)
        return player
      }
    }
    return null

  }

  async removePlayer(groupId: string, userId: string, playerId: string) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.players = group.relations.players.filter((value: string) => value === playerId)

      return await this.updateActiveGroup(group)
    }
    return groupQuery
  }

  async addMember(groupId: string, userId: string, player: IPlayer) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    let playerId = ""
    const existingPlayer = await this.playerService.getGroupPlayer(userId, groupId)

    if (existingPlayer.data?.id) {
      playerId = existingPlayer.data.id
    } else {
      const groupPlayer = await this.playerService.createPlayer({
        groupId,
        userId,
        name: player.name,
        tank: player.tank,
        healer: player.healer,
        dps: player.dps,
        locked: false,
        inTheRoll: false
      })
      if (groupPlayer?.id) {
        playerId = groupPlayer?.id
      }
    }

    if (groupQuery.success && groupQuery.data && playerId !== "") {
      const group = groupQuery.data
      group.relations.members = this.setFromStringArray(group.relations.members, userId)
      group.relations.players = this.setFromStringArray(group.relations.players, playerId)
      this.groupWs.playerJoinedGroup(player)
    
      return await this.updateActiveGroup(group)
    }
    return groupQuery
  }

  async removeMember(group: IGroup, userId: string) {
    const groupQuery = await this.setupUpdateGeneric(group.id, userId)
    const player = await this.playerService.getGroupPlayer(userId, group.id)
    if (groupQuery.success && groupQuery.data && player.data) {
      const group = groupQuery.data
      group.relations.members = group.relations.members.filter((value: string) => value !== userId)
      group.relations.players = group.relations.players.filter((value: string) => value !== player.data?.id)

      await this.playerService.deletePlayer(player.data.id)

      await this.updateActiveGroup(group)
      await this.groupWs.playerLeftGroup(player.data)
    }
    return groupQuery
  }

  async deleteGroup(id: string, userId: string): Promise<DataResponse<IGroup>> {
    const groupQuery = await this.groupRepo.getGroupById(id)
    const authorized = groupQuery.data && this.checkIfAuthorized(groupQuery.data, userId)
    if (!authorized) {
      return AuthorizationErrorResponse
    }

    return await this.groupRepo.deleteByUserId(id, userId)

  }

  checkIfAuthorized(group: IGroup, userIdFromRequest: string) {
    const groupOwner = group.userId === userIdFromRequest

    const inGroupMembers = group.relations.members.length > 0 && group.relations.members.includes(userIdFromRequest)
    if (!group.membersCanUpdate) {
      return groupOwner
    }
    return groupOwner || inGroupMembers
  }

  async userJoinGroup(groupId: string, userId: string) {
    try {
      const player = await this.playerService.getPlayerByUserId(userId)
      const groupRes = await this.getGroup(groupId, userId)
      if (player && groupRes.auth && groupRes.group) {
        const res = await this.addMember(groupId, userId, player)
        return res.success
      }
      return false

    } catch (e) {
      this.logger.error({
        message: "unable to join group",
        groupId,
        userId,
        error: e.message,
        stacktrace: e.stacktrace
      })
      throw {
        status: HTTPCodes.SERVER_ERROR
      }
    }

  }





}