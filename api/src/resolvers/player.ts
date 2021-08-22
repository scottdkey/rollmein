
import { User } from "../entites/User";
import { Field, Resolver, Mutation, InputType, Query, Arg, UseMiddleware, Ctx, FieldResolver, Root } from "type-graphql";
import { Player } from "../entites/Player";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { BasicError } from "../utils/errorsHelpers";


@InputType()
class PlayerInput {
  @Field()
  name: string;
  @Field()
  tank: boolean;
  @Field()
  healer: boolean;
  @Field()
  dps: boolean;
  @Field()
  locked: boolean;
  @Field()
  inTheRoll: boolean;
}

@InputType()
class UpdatePlayerInput extends PlayerInput {
  @Field()
  id!: number;
  @Field()
  name: string;
  @Field()
  tank: boolean;
}


@Resolver(Player)
export class PlayerResolver {
  @Query(() => [Player])
  @UseMiddleware(isAuth)
  async players(
    @Ctx() { ctx, em }: MyContext
  ): Promise<Player[]> {
    return await em.find(Player, {
      user: {
        id: ctx.state.user?.id
      }
    })
  }
  @Query(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async player(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Player | BasicError[]> {
    const player = await em.findOne(Player, id)
    if (!player) {
      return [
        {
          type: "playerError",
          message: "player not found"
        }
      ]

    }
    return player
  }
  @Mutation(() => Player)
  @UseMiddleware(isAuth)
  async createPlayer(
    @Arg("input") input: PlayerInput,
    @Ctx() { ctx, em }: MyContext
  ): Promise<Player | BasicError[]> {
    const player = em.create(Player, {
      name: input.name,
      tank: input.tank,
      healer: input.healer,
      dps: input.dps,
      locked: input.locked,
      inTheRoll: input.inTheRoll,
      user: em.getReference(User, ctx.state.user?.id!)

    })
    await em.persistAndFlush(player)
    if (!player) {
      return [{
        type: "playerError",
        message: "unable to create player"
      }]

    }
    return player

  }


  @Mutation(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePlayer(
    @Ctx() { em }: MyContext,
    @Arg("input", () => UpdatePlayerInput, { nullable: true }) input: UpdatePlayerInput
  ): Promise<Player | BasicError[]> {
    const player = await em.findOne(Player, input.id)
    if (!player) {
      return [{
        type: "playerError",
        message: "no player Found"
      }]

    } else if (input === null) {
      return [
        {
          type: "inputError",
          message: "incorrect cannot be null"
        }
      ]

    } else {
      const { name, tank, dps, healer, inTheRoll, locked } = input
      player.name = name
      player.tank = tank
      player.dps = dps
      player.healer = healer
      player.inTheRoll = inTheRoll
      player.locked = locked
      await em.persist(player).flush()
    }
    return player

  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePlayer(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Player, { id })
    return true
  }
  @FieldResolver()
  async user(@Root() player: Player, @Ctx() { em }: MyContext): Promise<User> {
    return em.findOneOrFail(User, player.user.id)
  }
}







