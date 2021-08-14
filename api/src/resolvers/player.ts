
import { User } from "../entites/User";
import { Field, Resolver, Mutation, InputType, Query, Arg, UseMiddleware, Ctx, ObjectType, FieldResolver, Root } from "type-graphql";
import { Player } from "../entites/Player";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";


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
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
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
        id: ctx.state.user.id
      }
    })
  }
  @Query(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async player(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Player | FieldError[]> {
    const player = await em.findOne(Player, id)
    if (!player) {
      return [
        {
          field: "playerError",
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
  ): Promise<Player | FieldError[]> {
    const player = em.create(Player, {
      name: input.name,
      tank: input.tank,
      healer: input.healer,
      dps: input.dps,
      locked: input.locked,
      inTheRoll: input.inTheRoll,
      user: em.getReference(User, ctx.state.user.id)

    })
    await em.persistAndFlush(player)
    if (!player) {
      return [{
        field: "player",
        message: "unable to create player"
      }]

    }
    return player

  }


  @Mutation(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePlayer(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext,
    @Arg("input", () => PlayerInput, { nullable: true }) input: PlayerInput
  ): Promise<Player | FieldError[]> {
    const player = await em.findOne(Player, id)
    if (!player) {
      return [{
        field: "playerError",
        message: "no player Found"
      }]

    } else if (input === null) {
      return [
        {
          field: "inputError",
          message: "incorrect cannot be null"
        }
      ]

    } else {
      player.name = input.name
      player.tank = input.tank
      player.healer = input.healer
      player.dps = input.dps
      player.inTheRoll = input.inTheRoll
      player.locked = input.locked
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







