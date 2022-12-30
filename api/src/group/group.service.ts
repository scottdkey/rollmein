import { Next } from "koa";
import { Logger, LoggerService } from "../common/logger.service";
import { addToContainer } from "../container";
import { ApplicationErrorResponse, AuthorizationErrorResponse } from "../utils/errorsHelpers";
import { GroupRepository } from './group.repository';
import { MyContext } from "../../../types/Context";
import { ICreateGroup, IGroupUpdate, IGroup } from "../../../types/Group";
import { HTTPCodes } from "../../../types/HttpCodes.enum";
import { DataResponse } from "../../../types/DataResponse";


@addToContainer()
export class GroupService {
  private logger: Logger
  constructor(private groupRepo: GroupRepository, private ls: LoggerService) {
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
      data: res
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

      return await this.groupRepo.updateGroup(group)
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

  async addPlayer(groupId: string, userId: string, playerId: string) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.players = this.setFromStringArray(group.relations.players, playerId)

      return await this.groupRepo.updateGroup(group)
    }
    return groupQuery
  }

  async removePlayer(groupId: string, userId: string, playerId: string) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.players = group.relations.players.filter((value: string) => value === playerId)

      return await this.groupRepo.updateGroup(group)
    }
    return groupQuery
  }

  async addMember(groupId: string, userId: string, memberId: string) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.members = this.setFromStringArray(group.relations.members, memberId)

      return await this.groupRepo.updateGroup(group)
    }
    return groupQuery
  }

  async removeMember(groupId: string, userId: string, memberId: string) {
    const groupQuery = await this.setupUpdateGeneric(groupId, userId)
    if (groupQuery.success && groupQuery.data) {
      const group = groupQuery.data
      group.relations.members = group.relations.members.filter((value: string) => value === memberId)

      return await this.groupRepo.updateGroup(group)
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

  protected checkIfAuthorized(group: IGroup, userIdFromRequest: string) {
    const groupOwner = group.userId === userIdFromRequest

    const inGroupMembers = group.relations.members.length > 0 && group.relations.members.includes(userIdFromRequest)
    if (!group.membersCanUpdate) {
      return groupOwner
    }
    return groupOwner || inGroupMembers
  }

  async handleGroupsRoute(ctx: MyContext<{}, IGroup[] | IApplicationError>, next: Next) {
    let returnGroups: IGroup[] = []
    let error = false
    const user = ctx.state.user
    if (user) {
      try {
        const groups = await this.getGroupsByUserId(user.id)
        if (groups) {
          returnGroups = [...groups]
        }

      } catch (e) {
        this.logger.error({ message: 'get groups error', error: e })
        error = true
      }
    }
    try {
      const groups = await this.getGroups()
      if (groups.data) {
        returnGroups = [...returnGroups, ...groups.data]
      }
      if (groups.error) {
        this.logger.error({ message: "get groups error", error: groups.error })
      }
    } catch (e) {
      this.logger.error({ message: 'get groups error', error: e })
      error = true
    }
    if (!error) {
      ctx.status = HTTPCodes.OK
    }
    if (error) {
      ctx.status = HTTPCodes.NOT_FOUND
    }

    ctx.body = returnGroups

    await next()
  }


}