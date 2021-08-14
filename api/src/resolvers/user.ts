import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entites/User";
import { __forgetPasswordPrefix__, __secretKey__ } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { changeUserPassword, checkError, createUser, forgotUserPassword, loginUser, validateRegister } from "../utils/userHelper";

import { signJwt } from "../utils/jwtUtils";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}



@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  token?: string
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { ctx }: MyContext): string {
    // this is the current user and its ok to show them their own email
    if (ctx.state.user && ctx.state.user.id === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    return await changeUserPassword(newPassword, token, em)
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    return await forgotUserPassword(email, em)
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { ctx }: MyContext): User | null {
    // no user found or token invalid
    if (!ctx.state.user) {
      return null;
    } {
      return ctx.state.user
    }

  }
  @Query(() => String, { nullable: true })
  refreshToken(@Ctx() { ctx }: MyContext): String | null {
    // no user found or token invalid
    if (!ctx.state.user) {
      return null;
    } {
      return signJwt(ctx.state.user.id)
    }

  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, ctx }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    try {
      const returnObject = await createUser(em, options)
      ctx.state.user = returnObject.user
      return returnObject
    } catch (err) {
      return checkError(err)
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { ctx, em }: MyContext
  ): Promise<UserResponse> {
    const returnObject = await loginUser(usernameOrEmail, em, password)
    if (returnObject.user) {
      ctx.state.user = returnObject.user
    }

    return returnObject

  }

  // @Mutation(() => Boolean)
  // logout(@Ctx() { ctx }: MyContext): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     try {
  //       ctx.state.user = null
  //       resolve(true)
  //     } catch (err) {
  //       console.error(err)
  //       resolve(false)
  //     }
  //   }
  //   )
  // }
}
