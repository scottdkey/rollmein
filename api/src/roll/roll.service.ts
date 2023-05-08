import { Logger } from 'pino';
import { addToContainer } from '../container';
import { GroupService } from '../group/group.service';
import { GroupWsService } from '../group/groupWs.service';
import { LoggerService } from '../logger/logger.service';
import { PlayerService } from '../player/player.service';
import { RollRepository } from './roll.repository';
import { RollUtilities } from './roll.utilities';
import { IGroup } from '../../../shared/types/Group';
import { GroupCountService } from '../groupCount/groupCount.service';

@addToContainer()
export class RollService {
  private logger: Logger
  constructor(
    private ls: LoggerService,
    private groupService: GroupService,
    private playerService: PlayerService,
    private webSocketService: GroupWsService,
    private rollUtilities: RollUtilities,
    private rollRepository: RollRepository,
    private groupCountService: GroupCountService
  ) {
    this.logger = this.ls.getLogger(RollService.name)
  }

  getRoll = async (groupId: string, userId: string) => {
    const groupRes = await this.groupService.getGroup(groupId, userId)
    if (groupRes && groupRes.auth) {
      return await this.rollRepository.getRoll(groupId)
    }
    return null
  }

  private async setupGroupRoll(groupId: string, userId: string) {
    const { group: groupData, auth } = await this.groupService.getGroup(groupId, userId)
    const playersData = await this.playerService.getPlayersByGroupId(groupId)

    const playersIn = this.rollUtilities.inPlayers(playersData)

    return this.rollUtilities.validateRollGroup(auth, groupData, playersIn)
  }

  private updatePlayerAfterRoll = async ({
    playerId,
    locked,
    inTheRoll
  }: { playerId: string, locked: boolean, inTheRoll: boolean }) => {
    const player = await this.playerService.getPlayerById(playerId)
    if (!player) return
    await this.playerService.updatePlayer({
      ...player,
      locked,
      inTheRoll
    })
  }

  async updatePlayersAfterRoll(group: IGroup, rollReturn: RollReturn) {
    const currentRoll = rollReturn.currentRoll
    const remainingPlayers = rollReturn.remainingPlayers

    if (!currentRoll) return
    if (!remainingPlayers) return

    const { dps, tank, healer, ffa } = currentRoll
    if (group.lockAfterOut && remainingPlayers.length > 0) {
      rollReturn.remainingPlayers.forEach(async (playerId) => {
        await this.updatePlayerAfterRoll({ playerId, locked: true, inTheRoll: true })
      })
    }
    if (tank) {
      await this.updatePlayerAfterRoll({ playerId: tank, inTheRoll: true, locked: false })
    }
    if (healer) {
      await this.updatePlayerAfterRoll({ playerId: healer, inTheRoll: true, locked: false })
    }
    if (dps) {
      dps.forEach(async (playerId) => {
        await this.updatePlayerAfterRoll({ playerId, inTheRoll: true, locked: false })
      })
    }
    if (ffa) {
      ffa.forEach(async (playerId) => {
        await this.updatePlayerAfterRoll({ playerId, inTheRoll: true, locked: false })
      })
    }

  }

  async roll(groupId: string, userId: string): Promise<RollReturn> {
    const getRoll = await this.rollRepository.getRoll(groupId)
    const { rollType, players, group } = await this.setupGroupRoll(groupId, userId)

    const previousRolls = getRoll.currentRoll ? [...getRoll.previousRolls, getRoll.currentRoll] : getRoll.previousRolls

    const rollReturn = await this.rollUtilities.handleRoll(rollType, players, previousRolls)

    await this.updatePlayersAfterRoll(group, rollReturn)

    await this.webSocketService.rollUpdated(groupId, rollReturn)

    await this.rollRepository.setRollToCache(groupId, rollReturn)

    await this.groupCountService.updateActiveGroupCounts(groupId)

    return rollReturn
  }

  async startRoll(groupId: string): Promise<RollStartResponse> {
    this.logger.info({ message: groupId })
    return {
      success: true
    }
  }

}

