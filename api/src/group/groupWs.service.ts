import { Redis } from "ioredis"
import { addToContainer } from "../container"
import { LoggerService } from "../logger/logger.service"
import { RedisService } from "../redis/redis.service"
import { Logger } from "pino"
import { RedisKeys } from "../redis/redisKeys.enum"
import { IGroupWsResponse, IGroup } from "../types/Group"
import { GroupWSMessageTypes } from "../types/GroupMessages.enum"


@addToContainer()
export class GroupWsService {
  private logger: Logger
  constructor(private redisService: RedisService, private ls: LoggerService) {
    this.logger = this.ls.getLogger(GroupWsService.name)
  }

  groupPub = async (groupId: string, message: IGroupWsResponse) => {
    try {
      this.redisService.publish(RedisKeys.GROUP, groupId, message)
    } catch (e) {
      this.logger.error({
        message: "error publishing",
        error: e
      })
    }
  }

  async groupUpdated(group: IGroup) {
    await this.groupPub(group.id, {
      messageType: GroupWSMessageTypes.GroupUpdated,
      data: group
    })
  }
  async tooManyLocked(groupId: string, count: number) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.TooManyLocked,
      data: null,
      announce: {
        status: "info",
        title: `Currently ${count} are locked in the roll, seems like too many`,
      },
    })
  }
  async updateGroupCount(groupId: string, groupCount: PlayerCounts) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.CountUpdated,
      data: groupCount
    })
  }

  async playerJoinedGroup(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.JoinGroup,
      announce: {
        title: `${player.name} joined the group.`,
        status: 'info'
      },
      data: player
    })
  }

  async playerUpdated(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.PlayerUpdated,
      data: player
    })
  }

  async playerLeftGroup(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.RemoveMember,
      data: player
    })
  }
  async playerWasAdded(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.AddPlayer,
      data: player
    })
  }

  async openWsConnection(group: IGroup) {
    await this.groupPub(group.id, {
      messageType: GroupWSMessageTypes.Open,
      data: group
    })
  }

  groupSub = async (group: IGroup | null, sub: Redis) => {
    if (group) {
      const redisKey = `${RedisKeys.GROUP}-${group.id}`
      const current = await this.redisService.get(RedisKeys.GROUP, group.id)

      if (current.data === null) {
        await this.redisService.set(RedisKeys.GROUP, group.id, group)
      }
      await sub.subscribe(redisKey, (err, count) => {
        if (err) {
          this.logger.error({
            message: `Failed to subscribe: %s ${err.message}`
          })
        } else {
          this.logger.info({
            message:
              `Subscribed successfully! This client is currently subscribed to ${count} channels.`
          });
        }
      })
    }
  }
}
