import { Next, ParameterizedContext } from "koa"
import { User } from "../../entites/User"
import argon2 from "argon2"
import { v4 } from "uuid"
import { validateRegister } from "../../utils/validateRegister";
import { redis } from "../redis"
import { FORGET_PASSWORD_PREFIX } from "../../constants";
import { sendEmail } from "../../utils/sendEmail";

class FieldError {
  field: string;
  message: string;
}

export class UserResponse {
  errors?: FieldError[]
  user?: User
}
export async function isAuth(ctx: ParameterizedContext) {
  if (!ctx.session?.userId) {
    throw new Error('not authenticated')
  }
}


export class UsernamePasswordInput {
  username: string;
  password: string;
  email: string;
}

export async function changePassword(token: string, newPassword: string, ctx: ParameterizedContext): Promise<UserResponse> {
  if (newPassword.length <= 2) {
    return {
      errors: [{
        field: 'newPassword',
        message: 'length must be greater than 2'
      }]
    }
  }
  const key = FORGET_PASSWORD_PREFIX + token
  const userId = await redis.get(key)
  if (!userId) {
    return {
      errors: [{
        field: 'token',
        message: "token expired"
      }]
    }
  }
  const user = await User.findOne(userId);
  if (!user) {
    return {
      errors: [{
        field: 'token',
        message: 'user no longer exists'
      }]
    }
  }
  await User.update({ id: userId }, { password: await argon2.hash(newPassword) })
  await redis.del(key)
  ctx.session!.userId = user.id;
  return { user }
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ where: { email } })
  const token = v4()
  if (!user) {
    //return true so as not to give away that we don't have a user with that email
    return true
  } else {

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    )
  }
  await sendEmail(
    email,
    `<a href="http://localhost:3000/change-password/${token}">reset password</a>`

  )
  return true

}

export async function me(ctx: ParameterizedContext) {
  if (!ctx.session?.userId) {
    return null;
  } else {
    return User.findOne(ctx.session.userId)
  }
}

export async function register(options: UsernamePasswordInput): Promise<UserResponse> {
  const errors = validateRegister(options)
  if (errors) {
    return { errors }
  }
  const hashedPassword = await argon2.hash(options.password)
  let user;
  try {
    user = await User.create({
      username: options.username,
      password: hashedPassword,
      email: options.email
    }).save()
  } catch (err) {
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


  return { user }

}

export async function login(options: { userNameOrEmail: string, password: string }): Promise<UserResponse> {
  const user = await User.findOne(options.userNameOrEmail.includes('@') ? { where: { email: options.userNameOrEmail } } : { where: { username: options.userNameOrEmail } })
  if (!user) {
    return {
      errors: [
        {
          field: "userNameOrEmail",
          message: "that username doesn't exist"
        }
      ],

    }
  }
  const valid = comparePass(user.password, options.password)
  if (!valid) {
    return {
      errors: [
        {
          field: "password",
          message: "incorrect password"
        }
      ]
    }

  }

  return {
    user
  }
}

export async function logout(ctx: ParameterizedContext, next: Next): Promise<boolean> {
  return new Promise(resolve => ctx.session?.destroy((err: Error) => {
    if (err) {
      console.error(err)
      resolve(false)
      return
    } else {
      resolve(true)
      ctx.session = null
    }
    next()
  }))

}


export function comparePass(userPassword: string, databasePassword: string) {
  return argon2.verify(userPassword, databasePassword);
}


