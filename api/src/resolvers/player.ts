import { Field, Resolver, Mutation, InputType, Query, Arg, Int, UseMiddleware, Ctx, ObjectType } from "type-graphql";
import { getConnection } from "typeorm";
import { Player } from "../entites/Player";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";


@InputType()
class PlayerInput {
  @Field()
  playerName: string;
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
class Error {
  @Field()
  type: string;
  @Field()
  message: string;
}

@ObjectType()
class PlayerResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => Player, { nullable: true })
  player?: Player;
}

@InputType()
class PlayerUpdateInput extends PlayerInput {
  @Field()
  id: number
  @Field()
  playerName: string;
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
@Resolver()
export class PlayerResolver {
  @Query(() => [Player])
  @UseMiddleware(isAuth)
  async players(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { ctx }: MyContext
  ): Promise<Player[]> {
    const realLimit = Math.min(50, limit)
    const qb = getConnection()
      .getRepository(Player)
      .createQueryBuilder('p')
      .where("userId = :uuid", { uuid: ctx.session.userId })
      .orderBy('"createdAt", "DESC')
      .take(realLimit)
    if (cursor) {
      qb.where('"createdAt" <:cursor', {
        cursor: new Date(parseInt(cursor))
      })
    }
    return qb.getMany()
  }
  @Query(() => Player, { nullable: true })
  async player(
    @Ctx() { ctx }: MyContext,
    @Arg("id") id: number): Promise<PlayerResponse> {
    const player = await Player.findOne(id)
    if (player?.userId === ctx.session.userId) {
      return {
        player
      }
    } else {
      return {
        errors: [{ type: "authError", message: "not authorized to access data" }]
      }
    }

  }
  @Mutation(() => Player)
  @UseMiddleware(isAuth)
  async createPlayer(
    @Arg("input") input: PlayerInput,
    @Ctx() { ctx }: MyContext
  ): Promise<Player | null> {
    if (ctx.session.userId) {
      return await Player.create({
        ...input,
        userId: ctx.session.userId
      }).save()
    } else {
      return null
    }
  }

  @Mutation(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePlayer(
    @Arg("id") id: number,
    @Arg("input", () => PlayerUpdateInput, { nullable: true }) input: PlayerUpdateInput
  ): Promise<PlayerResponse> {
    const player = await Player.findOne(id)
    if (!player) {
      return {
        errors: [{
          type: "authError",
          message: "not authorized to update"
        }]
      };
    } else if (input === null) {
      return {
        errors: [
          {
            type: "inputError",
            message: "incorrect input recieved"
          }
        ]
      }
    } else {
      await Player.update({ id }, { ...input })
      return {
        player
      }

    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePlayer(
    @Arg("id") id: number,
  ): Promise<boolean> {
    await Player.delete(id)
    return true
  }

}







