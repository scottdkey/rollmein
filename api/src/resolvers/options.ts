import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"

import { Options } from "../entites/Options"
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { createOpts, deleteOpts, validateUserOptionsInput } from "../utils/optionsHelpers";


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





@Resolver(Options)
export class OptionsResolver {
  @Query(() => Options, { nullable: true })
  @UseMiddleware(isAuth)
  async options(
    @Ctx() { ctx, em }: MyContext,
  ): Promise<Options | null> {
    const options = await em.findOne(Options, {
      userId: ctx.state.user?.id
    })
    if (!options) {
      return createOpts(ctx.state.user?.id!, em)
    }
    return options
  }

  @Mutation(() => Options, { nullable: true })
  @UseMiddleware(isAuth)
  async updateOptions(
    @Arg("input", () => OptionsInput, { nullable: true }) input: OptionsInput,
    @Ctx() { ctx, em }: MyContext,
  ): Promise<Options | OptionsError> {
    const userOptions = await em.findOne(Options, { userId: ctx.state.user?.id })
    if (userOptions) {
      const validOptionsorError = validateUserOptionsInput(ctx.state.user?.id!, input, userOptions)
      if (validOptionsorError.options !== undefined) {
        await em.persistAndFlush(validOptionsorError.options)
        return validOptionsorError.options
      } else {
        const unknownError = { type: "unknownErr", message: "unknown error occurred" }
        return validOptionsorError.error ? validOptionsorError.error : unknownError
      }
    } else {
      return {
        type: "dbErorr",
        message: "database did not find record"
      }
    }
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteOptions(
    @Ctx() { ctx, em }: MyContext
  ): Promise<boolean> {
    return await deleteOpts(ctx.state.user?.id!, em)
  }
}

