import { Logger, LoggerService } from "../common/logger.service";
import { addToContainer } from "../container";
import type { Group, GroupResponse, ICreateGroup, IGroupUpdateParams } from '../types/group';
import { ApplicationError, ApplicationErrorResponse, AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { GroupRepository } from './group.repository';


@addToContainer()
export class GroupService {
  private logger: Logger
  constructor(private groupRepo: GroupRepository, private loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(GroupService.name)
  }

  async getGroups() {
    return await this.groupRepo.getGroups()
  }

  async getGroupsByUserId(userId: string) {
    return await this.groupRepo.getGroupsByUserId(userId)
  }
  async createGroup(userId: string, createParams: ICreateGroup) {
    try {
      const res = await this.groupRepo.createGroup(userId, createParams)
      if (res.data || res.error) {
        return res
      }
      return ApplicationErrorResponse(new Error("createGroup Error"))

    } catch (e) {
      this.logger.error({ message: "create group error", error: e })
      return ApplicationErrorResponse(new Error(e.message))
    }
  }


  async updateGroup(
    groupId: string,
    userId: string,
    updateValueInput: IGroupUpdateParams): Promise<GroupResponse> {
    const groupQuery = await this.groupRepo.getGroupById(groupId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      const authorized = this.checkIfAuthorized(group, userId)
      if (!authorized) {
        return AuthorizationErrorResponse
      }
      group.members = updateValueInput.memberId ? [...new Set([...group.members, updateValueInput.memberId])] : group.members
      group.players = updateValueInput.playerId ? [...new Set([...group.players, updateValueInput.playerId])] : group.players
      group.rollType = updateValueInput.rollType ? updateValueInput.rollType : group.rollType
      group.lockAfterOut = updateValueInput.lockAfterOut ? updateValueInput.lockAfterOut : group.lockAfterOut
      group.membersCanUpdate = updateValueInput.membersCanUpdate ? updateValueInput.membersCanUpdate : group.membersCanUpdate
    }
    return groupQuery
  }
  async deleteGroup(id: string, userId: string): Promise<GroupResponse> {
    const groupQuery = await this.groupRepo.getGroupById(id)
    const authorized = groupQuery.data && this.checkIfAuthorized(groupQuery.data, userId)
    if (!authorized) {
      return AuthorizationErrorResponse
    }

    return await this.groupRepo.deleteByUserId(id, userId)

  }

  protected checkIfAuthorized(group: Group, userIdFromRequest: string) {
    if (!group.membersCanUpdate) {
      return group.userId === userIdFromRequest
    }
    return group.members.includes(userIdFromRequest)
  }
}