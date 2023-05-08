import { Logger } from 'pino';
import { addToContainer } from '../container';
import { GroupService } from '../group/group.service';
import { GroupWsService } from '../group/groupWs.service';
import { LoggerService } from '../logger/logger.service';
import { PlayerService } from '../player/player.service';
import { RollRepository } from './roll.repository';
import { RollUtilities } from './roll.utilities';

@addToContainer()
export class RollService {
  private logger: Logger
  constructor(
    private ls: LoggerService,
    private groupService: GroupService,
    private playerService: PlayerService,
    private webSocketService: GroupWsService,
    private rollUtilities: RollUtilities,
    private rollRepository: RollRepository
  ) {
    this.logger = this.ls.getLogger(RollService.name)
  }

  private async setupGroupRoll(groupId: string, userId: string) {
    const { group: groupData, auth } = await this.groupService.getGroup(groupId, userId)
    const playersData = await this.playerService.getPlayersByGroupId(groupId)

    return this.rollUtilities.validateRollGroup(auth, groupData, playersData)
  }

  async roll(groupId: string, userId: string): Promise<RollReturn> {
    const getRoll = await this.rollRepository.getRoll(groupId)
    const { rollType, players } = await this.setupGroupRoll(groupId, userId)


    const previousRolls = getRoll.currentRoll ? [...getRoll.previousRolls, getRoll.currentRoll] : getRoll.previousRolls

    const rollReturn = await this.rollUtilities.handleRoll(rollType, players, previousRolls)
    await this.webSocketService.rollUpdated(groupId, rollReturn)
    await this.rollRepository.setRollToCache(groupId, rollReturn)

    return rollReturn
  }

  async startRoll(groupId: string): Promise<RollStartResponse> {
    this.logger.info({ message: groupId })
    return {
      success: true
    }
  }

}

