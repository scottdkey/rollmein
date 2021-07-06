
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"

import { Options } from "../entites/Options"
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



@Resolver(Options)
export class OptionsResolver {
  @Query(() => Options, { nullable: true })
  @UseMiddleware(isAuth)
  async options(
    @Ctx() { ctx, em }: MyContext,
  ): Promise<Options | null> {
    const options = await em.findOne(Options, {
      userId: ctx.session.userId
    })
    return options
  }
  @Mutation(() => Options)
  @UseMiddleware(isAuth)
  async createOptions(
    @Ctx() { ctx, em }: MyContext
  ): Promise<Options> {
    const options = em.create(Options, {
      userId: ctx.session.userId
    })
    await em.persistAndFlush(options)
    return options
  }

  @Mutation(() => Options, { nullable: true })
  @UseMiddleware(isAuth)
  async updateOptions(
    @Arg("input", () => OptionsInput, { nullable: true }) input: OptionsInput,
    @Ctx() { ctx, em }: MyContext,
  ): Promise<Options | FieldError[]> {
    console.log(ctx.session.userId)
    const userOptions = await em.findOne(Options, { userId: ctx.session?.userId! })
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
    return userOptions
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteOptions(
    @Ctx() { ctx, em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Options, {
      userId: ctx.session.userId
    })
    return true
  }
}

