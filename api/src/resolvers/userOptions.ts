import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"
import { Player } from "../entites/Player";

import { UserOptions } from "../entites/UserOptions"
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types"



@ObjectType()
class Error {
  @Field()
  type: string;
  @Field()
  message: string;
}

@ObjectType()
class OptionsResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => UserOptions, { nullable: true })
  userOptions?: UserOptions;
}
@InputType()
class OptionsInput {
  @Field()
  rollType: string
  @Field()
  lockAfterOut: boolean
  @Field()
  theme: string
  @Field()
  userId: string
}
@InputType()
class UpdateOptionsInput extends OptionsInput {
  @Field()
  id: number
}

export const createOptions = async (input: OptionsInput, userId: string) => {
  return await UserOptions.create({
    ...input,
    userId
  }).save()
}


@Resolver()
export class UserOptionsResolver {
  @Query(() => UserOptions, { nullable: true })
  async options(
    @Ctx() { req }: MyContext,
  ): Promise<OptionsResponse> {
    const options = await UserOptions.findOne({ userId: req.session.userId })
    if (options) {
      return {
        userOptions: options
      }
    } else {
      return {
        errors: [{ type: "notFoundError", message: "not found please create" }]
      }
    }

  }
  @Mutation(() => UserOptions)
  @UseMiddleware(isAuth)
  async createUserOptions(
    @Arg("input") input: OptionsInput,
    @Ctx() { req }: MyContext
  ): Promise<UserOptions> {
    return await createOptions(input, req.session.userId)
  }

  @Mutation(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserOptions(
    @Arg("input", () => UpdateOptionsInput, { nullable: true }) input: UpdateOptionsInput,
    @Arg("id") id: number,
    @Ctx() { req }: MyContext,
  ): Promise<OptionsResponse> {
    const userOptions = await UserOptions.findOne({ userId: req.session.userId })
    if (!userOptions) {
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
            message: "null input recieved"
          }
        ]
      }
    } else {
      await UserOptions.update({ id }, { ...input })
      return {
        userOptions
      }

    }
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteOptions(
    @Arg("id") id: number,
  ): Promise<boolean> {
    await UserOptions.delete(id)
    return true
  }

}