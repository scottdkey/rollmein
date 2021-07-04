import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql"
import { Player } from "../entites/Player";

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

@ObjectType()
class OptionsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

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
}
@InputType()
class UpdateOptionsInput extends OptionsInput {
  @Field()
  id: number
}



@Resolver()
export class UserOptionsResolver {
  @Query(() => UserOptions, { nullable: true })
  async options(
    @Ctx() { ctx }: MyContext,
  ): Promise<OptionsResponse> {
    if (ctx.session.userId) {
      const options = await UserOptions.findOne({ userId: ctx.session.userId! })
      if (options) {
        return {
          userOptions: options
        }
      } else {
        return {
          errors: [{ field: "notFoundError", message: "not found please create" }]
        }
      }
    } else {
      return {
        errors: [
          {
            field: "noUser",
            message: "no userId found"
          }
        ]
      }
    }



  }
  @Mutation(() => UserOptions)
  @UseMiddleware(isAuth)
  async createUserOptions(
    @Arg("input") input: OptionsInput,
    @Ctx() { ctx }: MyContext
  ): Promise<OptionsResponse> {
    const options = await UserOptions.create({
      ...input,
      userId: ctx.session.userId!
    }).save()
    if (!options) {
      return {
        errors: [{
          field: "optionsCreate",
          message: "error creating options"
        }]
      }
    } else {
      return {
        userOptions: options
      }
    }
  }

  @Mutation(() => Player, { nullable: true })
  @UseMiddleware(isAuth)
  async updateUserOptions(
    @Arg("input", () => UpdateOptionsInput, { nullable: true }) input: UpdateOptionsInput,
    @Arg("id") id: number,
    @Ctx() { ctx }: MyContext,
  ): Promise<OptionsResponse> {

    const userOptions = await UserOptions.findOne({
      userId: ctx.session.userId!
    }
    )
    if (!userOptions) {
      return {
        errors: [{
          field: "authError",
          message: "not authorized to update"
        }]
      };
    } else if (input === null) {
      return {
        errors: [
          {
            field: "inputError",
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