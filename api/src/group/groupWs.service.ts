import { Redis } from "ioredis"
import { IGroup, IGroupWsResponse } from "../types/Group"
import { GroupWSMessageTypes } from "../types/GroupMessages.enum"
import { addToContainer } from "../container"
import { LoggerService } from "../logger/logger.service"
import { RedisService, RedisKeys } from "../redis/redis.service"
import { Logger } from "pino"


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
      refetchQueries: [`groupCount-${group.id}`],
      setData: [{
        id: `group-${group.id}`,
        data: group
      }]
    })
  }
  async tooManyLocked(groupId: string, count: number) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.TooManyLocked,
      announceMessage: `Currently ${count} are locked in the roll, seems like too many`,
    })
  }
  async updateGroupCount(groupId: string, groupCount: PlayerCounts) {
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.CountUpdated,
      setData: [{
        id: `groupCount-${groupId}`,
        data: groupCount
      }]
    })
  }

  async playerJoinedGroup(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.JoinGroup,
      announceMessage: `${player.name} joined the group.`,
      refetchQueries: [`groupCount-${groupId}`],
      setData: [{
        id: `player-${player.id}`,
        data: player
      }]
    })
  }

  async playerUpdated(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.PlayerUpdated,
      refetchQueries: [`groupCount-${groupId}`],
      setData: [{
        id: `player-${player.id}`,
        data: player
      }]
    })
  }

  async playerLeftGroup(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.RemoveMember,
      announceMessage: `${player.name} left the group`,
      refetchQueries: [`group-${groupId}`, `groupCount-${groupId}`],
      deleteData: [`player-${player.id}`]
    })
  }
  async playerWasAdded(player: IPlayer) {
    const groupId = player.groupId as string
    await this.groupPub(groupId, {
      messageType: GroupWSMessageTypes.AddPlayer,
      announceMessage: `${player.name} was added to the group`,
      refetchQueries: [`group-${groupId}`, `groupCount-${groupId}`],
      setData: [{
        id: `player-${player.id}`,
        data: player
      }]
    })
  }

  async openWsConnection(group: IGroup) {
    await this.groupPub(group.id, {
      messageType: GroupWSMessageTypes.Open
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
