
import { Ctx, Field, InputType, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"
import { Options } from "../entities/Options";
import { Player } from "../entities/Player";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { BasicError } from "../utils/errorsHelpers";
import { FFARoll, rollByRole, RollReturn, inCheck, validRoll } from "../utils/rollHelpers";



@ObjectType()
export class OptionsError {
  @Field()
  type: string;
  @Field()
  message: string;
}
@InputType()
export class OptionsInput {
  @Field()
  rollType!: string
  @Field()
  lockAfterOut!: boolean
  @Field()
  theme!: string
}

@Resolver()

export class RollResolver {
  @Query()
  @UseMiddleware(isAuth)
  async roll(@Ctx() { ctx, em }: MyContext): Promise<RollReturn | BasicError[]> {
    const { rollType } = await em.findOneOrFail(Options, { userId: ctx.state.user?.id })
    const players = await em.find(Player, { user: ctx.state.user })
    const { valid, errors } = validRoll(players, rollType)
    if (valid) {
      if (rollType === "ffa") {
        return FFARoll(players)
      } else {
        return rollByRole(players)
      }
    } else {
      return errors
    }


  }
  @Query()
  @UseMiddleware(isAuth)
  async numberIn(@Ctx() { ctx, em }: MyContext): Promise<number> {
    const players = await em.find(Player, { user: ctx.state.user })
    return inCheck(players)
  }

}

