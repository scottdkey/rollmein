import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"

import { UserOptions } from "../entites/UserOptions"
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";



@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@InputType()
class OptionsInput {
  @Field()
  rollType!: string
  @Field()
  lockAfterOut!: boolean
  @Field()
  theme!: string
}



@Resolver()
export class UserOptionsResolver {
  @Query(() => UserOptions, { nullable: true })
  async options(
    @Ctx() ctx: MyContext,
  ): Promise<UserOptions | null> {
    const options = await ctx.em.findOne(UserOptions, {
      userId: ctx.ctx.session.userId
    })
    if (!options) {
      return await this.createUserOptions(ctx)
    }
    return options
  }
  @Mutation(() => UserOptions)
  @UseMiddleware(isAuth)
  async createUserOptions(
    @Ctx() { ctx, em }: MyContext
  ): Promise<UserOptions> {
    const options = em.create(UserOptions, {
      userId: ctx.session.userId
    })
    await em.persistAndFlush(options)
    return options
  }

  @Mutation(() => UserOptions, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserOptions(
    @Arg("input", () => OptionsInput, { nullable: true }) input: OptionsInput,
    @Ctx() { ctx, em }: MyContext,
  ): Promise<UserOptions | FieldError[]> {
    console.log(ctx.session.userId)
    const userOptions = await em.findOne(UserOptions, { userId: ctx.session?.userId! })
    if (userOptions === null) {
      return [{
        field: "authError",
        message: "not authorized to update"
      }]

    } else if (input === null) {
      return [
        {
          field: "inputError",
          message: "null input recieved"
        }
      ]
    }
    userOptions.lockAfterOut = input.lockAfterOut
    userOptions.rollType = input.rollType
    userOptions.theme = input.theme
    await em.persistAndFlush(userOptions)
    console.log(userOptions)
    return userOptions
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteOptions(
    @Ctx() { ctx, em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(UserOptions, {
      userId: ctx.session.userId
    })
    return true
  }
}

