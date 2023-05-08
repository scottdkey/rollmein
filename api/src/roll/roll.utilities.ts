import { IApplicationError } from "../../../shared/types/ApplicationError";
import { ErrorTypes } from "../../../shared/types/ErrorCodes.enum";
import { ErrorMessages } from "../../../shared/types/ErrorTypes.enum";
import { IGroup } from "../../../shared/types/Group";
import { PlayerRoles } from "../../../shared/types/PlayerRoles.enum";
import { RollType } from "../../../shared/types/RollType.enum";
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
          if (tank === undefined || healer === undefined || dps === undefined) {
            //the per mutations of this roll produced an empty roll
            // got to try to figure out how to approach when one user is tank, healer, dps,  and they are the only healer
            throw createError({
              message: "this roll produced an empty roll",
              type: ErrorTypes.ROLL_ERROR,
              context: this.handleRoll.name,
              detail: {
                rollType,
                tank,
                healer,
                dps,
              }

            })
          }
          returnObject.currentRoll = {
            tank: tank.id,
            healer: healer.id,
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
        stacktrace: e.stack,
      })
      this.logger.error(error)
      throw error
    }
  }

  removeFromGroup(
    pickedPlayer: IPlayer,
    remainingPlayers: IPlayer[]
  ): IPlayer[] {
    if (pickedPlayer !== undefined) {
      const returnPlayers = remainingPlayers

      return returnPlayers.filter(player => player.id !== pickedPlayer.id);
    }

    return remainingPlayers

  }

  playerIdsFromPlayers(players: IPlayer[]): string[] {
    const playersWithoutUndefined = players.filter(p => p !== undefined)
    return playersWithoutUndefined.map((player) => player.id)
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
    console.log({ tankRoll: tankRoll.remaining })
    const healerRoll = this.rollForRole(PlayerRoles.HEALER, tankRoll.remaining);
    const dpsRoll = this.rollForDps(healerRoll.remaining);
    return {
      tank: tankRoll.player,
      healer: healerRoll.player,
      dps: dpsRoll.players,
      remaining: dpsRoll.remaining
    };
  }

  randomFromArray(players: IPlayer[]): IPlayer {
    return players[Math.floor(Math.random() * players.length)];
  }

  rollForRole(role: string, players: IPlayer[]): { player: IPlayer, remaining: IPlayer[] } {
    const playerGroup: IPlayer[] = players.filter(
      (player) => player[role as keyof IPlayer] === true
    );
    const playerWithRole = this.rollWithLocked(playerGroup)
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
    const locked = this.lockedCount(players)
    const inTheRoll = this.inPlayers(players)
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
    return players.filter(p => p.locked).length
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
    let dpsCount = 0
    while (dpsCount < 3) {
      const { player, remaining: r } = this.rollForRole(PlayerRoles.DPS, remaining);
      players.push(player);
      remaining = r;
      dpsCount++
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

    const isRoleBased = rollType === RollType.ROLE

    if (isRoleBased) {
      if (playerCounts.tanks >= counts.tanks === false) {
        errorArray.push(ErrorMessages.MustHaveTank)

      }
      if (playerCounts.dps >= counts.dps === false) {
        errorArray.push(ErrorMessages.MustHaveCorrectDps)

      }
      if (playerCounts.healers >= counts.healers === false) {
        errorArray.push(ErrorMessages.MustHaveHealer)

      }
    }
    if (playerCounts.inTheRoll < counts.players) {
      errorArray.push(ErrorMessages.MustCorrectPlayers)
    }

    const combinedError: IApplicationError = {
      message: ErrorMessages.ROLL_ERROR,
      type: ErrorTypes.ROLL_ERROR,
      context: this.validRoll.name,
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
      errors.push("no players found")
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