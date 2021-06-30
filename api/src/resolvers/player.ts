import { Resolver, Query, Arg, Mutation, InputType, Field, Ctx, UseMiddleware, Int, FieldResolver, Root } from "type-graphql";
import { getConnection } from "typeorm";
import { Player } from "../entites/Player";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";


@InputType()
class PlayerInput {
  @Field()
  playerName: string
  @Field()
  tank: boolean
  @Field()
  dps: boolean
  @Field()
  healer: boolean
  @Field()
  locked: boolean
  @Field()
  inTheRoll: boolean
  @Field()
  userId: string
}

@Resolver(Player)
export class PlayerResolver {

  @Query(() => [Player])
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Player[]> {
    const realLimit = Math.min(50, limit)
    const qb = getConnection()
      .getRepository(Player)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit)

    if (cursor) {
      qb.where('"createdAt" <:cursor', {
        cursor: new Date(parseInt(cursor))
      })
    }
    return qb.getMany()
  }

  @Query(() => Player, { nullable: true })
  async player(@Arg("id") id: number): Promise<Player | undefined> {
    return await Player.findOne(id);
  }

  @Mutation(() => Player)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PlayerInput,
    @Ctx() { ctx }: MyContext
  ): Promise<Player> {
    return await Player.create({
      ...input,
      userId: ctx.session?.userId
    }).save();
  }

  @Mutation(() => Player, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("playerName", () => String, { nullable: true }) playerName: string,
    @Arg("tank", () => Boolean, { nullable: true }) tank: boolean,
    @Arg("dps", () => Boolean, { nullable: true }) dps: boolean,
    @Arg("healer", () => Boolean, { nullable: true }) healer: boolean,
    @Arg("locked", () => Boolean, { nullable: true }) locked: boolean,
    @Arg("inTheRoll", () => Boolean, { nullable: true }) inTheRoll: boolean,
  ): Promise<Player | null> {
    const player = await Player.findOne(id)
    if (!player) {
      return null;
    }
    if (typeof playerName !== "undefined") {
      await Player.update({ id }, {
        playerName,
        tank,
        dps,
        healer,
        locked,
        inTheRoll
      })
    }
    return player;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number,): Promise<boolean> {
    await Player.delete(id)
    return true;
  }
}