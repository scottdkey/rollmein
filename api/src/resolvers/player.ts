import { Field, Resolver, Mutation, InputType, Query, Arg, UseMiddleware, Ctx, ObjectType } from "type-graphql";
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
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class PlayerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

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
    @Ctx() { ctx }: MyContext
  ): Promise<Player[]> {
    const players = await Player.find({ where: { userId: ctx.session.userId } })
    console.log(players)
    return players
  }
  @Query(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async player(
    @Arg("id") id: number): Promise<PlayerResponse> {
    const player = await Player.findOne(id)
    console.log(player)
    if (!player) {
      return {
        errors: [
          {
            field: "playerError",
            message: "player not found"
          }
        ]
      }
    } else {
      return { player }
    }

  }
  @Mutation(() => Player)
  @UseMiddleware(isAuth)
  async createPlayer(
    @Arg("input") input: PlayerInput,
    @Ctx() { ctx }: MyContext
  ): Promise<PlayerResponse> {
    const player = await Player.create({
      ...input,
      userId: ctx.session.userId!
    }
    ).save()
    if (!player) {
      return {
        errors: [{
          field: "player",
          message: "unable to create player"
        }]
      }
    } else {
      console.log(player)
      return {
        player
      }
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
          field: "playerError",
          message: "no player Found"
        }]
      };
    } else if (input === null) {
      return {
        errors: [
          {
            field: "inputError",
            message: "incorrect cannot be null"
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







