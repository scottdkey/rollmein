import { IApplicationError } from "../../../shared/types/ApplicationError";
import { ErrorTypes } from "../../../shared/types/ErrorCodes.enum";
import { ErrorMessages } from "../../../shared/types/ErrorTypes.enum";
import { IGroup } from "../../../shared/types/Group";
import { RollType } from "../../../shared/types/Group.enum";
import { PlayerRoles } from "../../../shared/types/PlayerRoles.enum";
import { addToContainer } from "../container";
import { LoggerService } from "../logger/logger.service";
import { createError } from "../utils/CreateError";


@addToContainer()
export class RollUtilities {
  private logger = this.ls.getLogger(RollUtilities.name)
  constructor(private ls: LoggerService) { }

  handleRoll(rollType: RollType, players: IPlayer[], previousRolls: IPreviousRoll[]): RollReturn {
    try {
      const returnObject: RollReturn = {
        started: false,
        currentRoll: null,
        remainingPlayers: [],
        previousRolls,
        lastCompletedTimestamp: new Date()
      }
      const validRoll = this.validRoll(players, rollType)
      if (validRoll) {
        if (rollType === RollType.FFA) {
          const { ffaRoll, remaining } = this.FFARoll(players)
          returnObject.currentRoll = {
            tank: null,
            healer: null,
            dps: null,
            ffa: this.playerIdsFromPlayers(ffaRoll)
          }
          returnObject.remainingPlayers = this.playerIdsFromPlayers(remaining)
          return returnObject
        }

        if (rollType === RollType.ROLE) {
          const { tank, dps, healer, remaining } = this.rollByRole(players)
          returnObject.currentRoll = {
            tank: this.playerIdFromPlayer(tank),
            healer: this.playerIdFromPlayer(healer),
            dps: this.playerIdsFromPlayers(dps),
            ffa: null
          }
          returnObject.remainingPlayers = this.playerIdsFromPlayers(remaining)
        }
      }
      return returnObject
    } catch (e) {
      const error = createError({
        message: e.message,
        type: ErrorTypes.ROLL_ERROR,
        context: this.handleRoll.name,
        stacktrace: e.stacktrace,
      })
      this.logger.error(error)
      throw error
    }
  }

  removeFromGroup(
    pickedPlayer: IPlayer,
    remainingPlayers: IPlayer[]
  ): IPlayer[] {
    return remainingPlayers.filter(
      (player) => player.id !== pickedPlayer.id
    );
  }

  playerIdFromPlayer(player: IPlayer): string {
    return player.id
  }

  playerIdsFromPlayers(players: IPlayer[]): string[] {
    return players.map((player) => this.playerIdFromPlayer(player))
  }

  FFARoll(currentGroup: IPlayer[], numberOfPlayers: number = 5): { ffaRoll: IPlayer[]; remaining: IPlayer[] } {
    let remaining = currentGroup
    const ffaRoll: IPlayer[] = []

    while (ffaRoll.length < numberOfPlayers) {
      const pickedPlayer = this.rollWithLocked(remaining)
      ffaRoll.push(pickedPlayer)
      remaining = this.removeFromGroup(pickedPlayer, remaining)
    }
    return { ffaRoll, remaining }
  }

  rollByRole(currentGroup: IPlayer[]): {
    tank: IPlayer;
    healer: IPlayer;
    dps: IPlayer[];
    remaining: IPlayer[];
  } {
    const tankRoll = this.rollForRole(PlayerRoles.TANK, currentGroup);
    const healerRoll = this.rollForRole(PlayerRoles.HEALER, tankRoll.remaining);
    const dpsRoll = this.rollForDps(healerRoll.remaining);
    const players = { tank: tankRoll.player, healer: healerRoll.player, dps: dpsRoll.players }
    return { ...players, remaining: dpsRoll.remaining };
  }

  randomFromArray(players: IPlayer[]): IPlayer {
    return players[Math.floor(Math.random() * players.length)];
  }

  rollForRole(role: string, players: IPlayer[]): { player: IPlayer, remaining: IPlayer[] } {
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

  rollWithLocked(players: IPlayer[]): IPlayer {
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

  lockedCount(players: IPlayer[]): number {
    return players.filter(p => p.inTheRoll).length
  }

  inPlayers(players: IPlayer[]): IPlayer[] {
    return players.filter(p => p.inTheRoll)
  }

  inCount(players: IPlayer[]): number {
    return this.inPlayers(players).length
  }

  rollForDps(currentGroup: IPlayer[]): { remaining: IPlayer[], players: IPlayer[] } {
    let remaining = currentGroup;

    const players: IPlayer[] = [];
    for (let dpsCount = 1; dpsCount < 4; dpsCount++) {
      const pickedDPS = this.rollForRole(PlayerRoles.DPS, remaining);
      players.push(pickedDPS.player);
      remaining = pickedDPS.remaining;
    }
    return { remaining, players };
  }

  validRoll = (players: IPlayer[], rollType: RollType, counts: {
    players: number
    tanks: number
    healers: number
    dps: number
  } = {
      players: 5,
      tanks: 1,
      healers: 1,
      dps: 3
    }) => {
    const playerCounts = this.playerCounts(players, rollType)
    const errorArray: string[] = []
    const invalidRollError = (message: ErrorMessages) => {
      errorArray.push(message)
    }
    const isRoleBased = rollType === RollType.ROLE
    if (isRoleBased && playerCounts.tanks <= counts.tanks) {
      invalidRollError(ErrorMessages.MustHaveTank)

    }
    if (isRoleBased && playerCounts.dps <= counts.dps) {
      invalidRollError(ErrorMessages.MustHaveCorrectDps)

    }
    if (isRoleBased && playerCounts.healers <= counts.healers) {
      invalidRollError(ErrorMessages.MustHaveHealer)

    }
    if (playerCounts.inTheRoll < counts.players) {
      invalidRollError(ErrorMessages.MustCorrectPlayers)
    }

    const combinedError: IApplicationError = {
      message: ErrorMessages.ROLL_ERROR,
      type: ErrorTypes.ROLL_ERROR,
      context: "handleRoll",
      detail: errorArray.join(",")
    }
    if (errorArray.length > 0) {
      throw (combinedError)
    }
    return true
  }

  validateRollGroup = (auth?: boolean, group?: IGroup | null, players?: IPlayer[] | null) => {
    const rollType = group?.rollType
    const errors: string[] = []
    if (!auth) {
      errors.push("user not authorized for this action")
    }
    if (!group) {
      errors.push("no group found")
    }
    if (!players) {
      errors.push("no group found")
    }
    if (!rollType) {
      errors.push("no roll type found")
    }
    if (errors.length > 0 || !players || !rollType || !group) {
      const error: IApplicationError = {
        message: ErrorMessages.ROLL_ERROR,
        type: ErrorTypes.ROLL_ERROR,
        context: "validateRollGroup",
        detail: errors.join(",")
      }
      throw (error)
    }
    const valid = this.validRoll(players, rollType)
    return {
      players,
      rollType,
      group,
      valid
    }
  }
}