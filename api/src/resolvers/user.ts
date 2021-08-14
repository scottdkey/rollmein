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
import argon2 from "argon2";
import { __forgetPasswordPrefix__, __secretKey__ } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { redis } from "..";
import { Options } from "../entites/Options";
import jwt from "jsonwebtoken";


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

  @Field()
  token?: string
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { ctx }: MyContext): string {
    // this is the current user and its ok to show them their own email
    if (ctx.session?.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { ctx, em }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = __forgetPasswordPrefix__ + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }
    user.password = await argon2.hash(newPassword)
    await em.persist(user).flush()
    await redis.del(key);
    // log in user after change password
    ctx.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    const user = await em.findOne(User, { email });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    await redis.set(
      __forgetPasswordPrefix__ + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { ctx, em, id }: MyContext): Promise<User | null> | null {
    // you are not logged in
    

    return em.findOne(User, { id: id });


  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { ctx, em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);

    try {
      const user: User = em.create(User, {
        ...options,
        password: hashedPassword
      })
      await em.persist(user).flush()
      const id = user.id
      const userOptions = em.create(Options, {
        userId: id
      })
      await em.persist(userOptions).flush()
      // store user id session
      // this will set a cookie on the user
      // keep them logged in
      ctx.session.userId = id;
      return { user };
    } catch (err) {
      console.log(err)
      if (err.constraint === "user_email_unique") {
        return {
          errors: [{
            field: "email",
            message: "email already exists, please choose another"
          }]
        }
      } else if (err.constraint === "user_username_unique") {
        return {
          errors: [{
            field: "username",
            message: "username already exists, please choose another"
          }]
        }
      } else {
        return {
          errors: [{
            field: "error",
            message: `unexpected error ${err.constraint}`
          }]
        }
      }
    }


  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { ctx, em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail });
    if (!user) {
      console.log("no user found")
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that user doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      console.log("invalid")
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    const token = jwt.sign(
      {
        id: user.id,
      }, __secretKey__,
      { expiresIn: "1d" }
    )
    return {
      user,
      token
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { ctx }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        ctx.session.userId = null
        resolve(true)
      } catch (err) {
        console.error(err)
        resolve(false)
      }
    }
    )
  }
}
