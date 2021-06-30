import {
  Resolver,
  Mutation,
  Arg,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entites/User";
import argon2 from "argon2";
import { FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { v4 } from "uuid"
import { sendEmail } from "../utils/sendEmail";
import { redis } from "src/db/redis";

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
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { ctx }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [{
          field: 'newPassword',
          message: "length must be greater than 2",
        }
        ]
      }
    }
    const key = FORGET_PASSWORD_PREFIX + token
    const userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [{
          field: 'token',
          message: "token expired",
        }
        ]
      }
    }
    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists'
          }
        ]
      }
    }
    await User.update({ id: userId }, { password: await argon2.hash(newPassword) })
    await redis.del(key)
    //log in user after change password
    ctx.session!.userId = user.id;

    return { user }
  }


  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
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
  me(@Ctx() { ctx }: MyContext) {
    // you are not logged in
    if (ctx.session) {
      return User.findOne(ctx.session.userId);
    } else {
      return null;
    }

  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { ctx }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) {
      return { errors }
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email
      }).save()
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    ctx.session!.userId = user?.id!;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("userNameOrEmail") userNameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { ctx }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      userNameOrEmail.includes('@') ?
        { where: { email: userNameOrEmail } }
        :
        { where: { username: userNameOrEmail } });
    if (!user) {
      return {
        errors: [
          {
            field: "userNameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    ctx.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { ctx }: MyContext): Promise<boolean> {
    return new Promise(resolve => ctx.session?.destroy((err: Error) => {
      if (err) {
        console.error(err);
        resolve(false)
        return
      } else {
        ctx.session = null
        resolve(true)

      }

    }))
  }
}