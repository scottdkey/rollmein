import { ErrorTypes } from "../types/ErrorCodes.enum";
import { addToContainer } from "../container";
import { Logger, LoggerService } from "../common/logger.service";

@addToContainer()
export class RollService {
  private logger: Logger
  constructor(private ls: LoggerService) {
    this.logger = this.ls.getLogger(RollService.name)
    this.logger.info({ message: "RollService created" })

  }

  async addPlayerToRoll(body: IAddPlayerRequestBody) {
    this.logger.info({ message: "addPlayerToRoll", body })
    return true
  }

  lockedCount(players: IPlayer[]): number {
    return players.filter(p => p.inTheRoll).length
  }

  inCount(players: IPlayer[]): number {
    return players.filter(p => p.inTheRoll).length
  }

  playerCounts = (players: IPlayer[], rollType: RollType): PlayerCounts => {
    const locked = players.filter(p => p.locked).length
    const inTheRoll = players.filter(p => p.inTheRoll)
    if (rollType === RollType.ROLE) {
      const tanks = inTheRoll.filter(p => p.tank).length
      const healers = inTheRoll.filter(p => p.healer).length
      const dps = inTheRoll.filter(p => p.dps).length
      return {
        locked,
        inTheRoll: inTheRoll.length,
        tanks,
        healers,
        dps
      }
    } else {
      return {
        locked,
        inTheRoll: inTheRoll.length,
        tanks: 0,
        healers: 0,
        dps: 0
      }
    }
  };

  async startRoll(groupId: string): Promise<RollStartResponse> {
    this.logger.info({ message: groupId })
    return {
      success: true
    }
  }

  FFARoll(currentGroup: IPlayer[]): { players: IPlayer[]; remaining: IPlayer[] } {
    let remaining = currentGroup
    const players: IPlayer[] = []
    while (players.length > 5) {
      const pickedPlayer = this.rollWithLocked(remaining)
      players.push(pickedPlayer)
      remaining = this.removeFromGroup(pickedPlayer, remaining)
    }
    return { players, remaining }
  }

  rollByRole(currentGroup: IPlayer[]): DataResponse<{
    players: {
      tank: IPlayer;
      healer: IPlayer;
      dps: IPlayer[];
    };
    remaining: IPlayer[];
  }> {
    const validRoll = this.validRoll(currentGroup, RollType.ROLE)
    if (!validRoll.valid) {
      return {
        data: null,
        success: false,
        error: {
          type: ErrorTypes.INVALID_ROLL,
          message: validRoll.errors.join()
        }
      }
    }
    const tankRoll = this.rollForRole(PlayerRoles.TANK, currentGroup);
    const healerRoll = this.rollForRole(PlayerRoles.HEALER, tankRoll.remaining);
    const dpsRoll = this.rollForDps(healerRoll.remaining);
    const players = { tank: tankRoll.player, healer: healerRoll.player, dps: dpsRoll.players }
    return {
      data: { players, remaining: dpsRoll.remaining },
      success: true,
      error: null
    };
  }


  protected randomFromArray(players: IPlayer[]): IPlayer {
    return players[Math.floor(Math.random() * players.length)];
  }
  private removeFromGroup(
    pickedPlayer: IPlayer,
    remainingPlayers: IPlayer[]
  ): IPlayer[] {
    return remainingPlayers.filter(
      (player) => player.id !== pickedPlayer.id
    );
  }

  private rollForRole(role: string, players: IPlayer[]): { player: IPlayer, remaining: IPlayer[] } {
    const group: IPlayer[] = players.filter(
      (player) => player[role as keyof IPlayer] === true
    );
    const playerWithRole = this.rollWithLocked(group)
    const remaining = this.removeFromGroup(playerWithRole, players)

    return {
      player: playerWithRole,
      remaining
    }
  }

  protected rollWithLocked(players: IPlayer[]): IPlayer {
    const locked = players.filter((p: IPlayer) => p.locked);
    const outGroup = players.filter((p: IPlayer) => !p.locked)
    let pickedPlayer: IPlayer;
    if (locked.length > 0) {
      pickedPlayer = this.randomFromArray(locked);
    } else {
      pickedPlayer = this.randomFromArray(outGroup);
    }
    return pickedPlayer
  }

  private rollForDps(currentGroup: IPlayer[]): { remaining: IPlayer[], players: IPlayer[] } {
    let remaining = currentGroup;

    const players: IPlayer[] = [];
    for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
      const pickedDPS = this.rollForRole(PlayerRoles.DPS, remaining);
      players.push(pickedDPS.player);
      remaining = pickedDPS.remaining;
    }
    return { remaining, players };
  }

  protected createError(type: string, message: string): IApplicationError {
    return {
      type,
      message
    }
  }

  private validRoll = (players: IPlayer[], rollType: RollType): ValidRoll => {
    const playerCounts = this.playerCounts(players, rollType)
    const errorArray: IApplicationError[] = []
    const invalidRollError = (message: string) => {
      errorArray.push(this.createError("invalidRoll", message))
    }
    const isRoleBased = rollType === RollType.ROLE
    if (isRoleBased && playerCounts.tanks === 0) {
      invalidRollError("must have a tank")

    }
    if (isRoleBased && playerCounts.dps >= 3) {
      invalidRollError("must have at least 3 dps")

    }
    if (isRoleBased && playerCounts.healers === 0) {
      invalidRollError("must have a healer")

    }
    if (playerCounts.inTheRoll > 5) {
      invalidRollError("must have more than 5 players")
    }
    return {
      valid: errorArray.length < 1,
      errors: errorArray
    }
  }

}

export enum RollType {
  FFA = "ffa",
  ROLE = 'role'
}
export enum PlayerRoles {
  TANK = 'tank',
  DPS = 'dps',
  HEALER = 'healer'
}
