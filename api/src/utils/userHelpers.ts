import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Options } from "../entities/Options";
import { User } from "../entities/User";
import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import { signJwt } from "./jwtUtils";
import argon2 from "argon2";
import { __forgetPasswordPrefix__ } from "../constants";
import { redis } from "..";
import { sendEmail } from "./sendEmail";
import { v4 } from "uuid";
import { FieldError } from "./errorsHelpers";



export const passwordErrors = {
  length: 2,
  lengthError: {
    field: "password",
    message: "length must be greater than 2",
  },
}

export const emailErrors = {
  validEmail: {
    field: "email",
    message: "invalid email",
  },
  uniqueConstraint: { constraint: "user_email_unique" },
  unique: {
    field: "email",
    message: "email already exists, please choose another"
  }
}

export const usernameErrors = {
  length: 2,
  lengthError: {
    field: "username",
    message: "length must be greater than 2",
  },
  noAtSymbol: {
    field: "username",
    message: "username cannot contain @ symbol",
  },
  uniqueConstraint: { constraint: 'user_username_unique' },
  unique: {
    field: "username",
    message: "username already exists, please choose another"
  }
}

export const validateRegister = (options: UsernamePasswordInput): FieldError[] | null => {
  if (options.username.length <= usernameErrors.length) {
    return [
      usernameErrors.lengthError
    ];
  }

  if (options.password.length <= passwordErrors.length) {
    return [
      passwordErrors.lengthError
    ]
  }
  if (!options.email.includes('@')) {
    return [
      emailErrors.validEmail
    ]
  }
  if (options.username.includes('@')) {
    return [
      usernameErrors.noAtSymbol
    ]
  }
  return null
}

export const checkError = (err: any) => {
  if (err.constraint === emailErrors.uniqueConstraint.constraint) {
    return [emailErrors.unique]

  } else if (err.constraint == usernameErrors.uniqueConstraint.constraint) {
    return [usernameErrors.unique]
  } else {
    return [{
      field: "error",
      message: `unexpected error ${err.constraint}`
    }]

  }
}

export const createUser = async (em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>, input: UsernamePasswordInput) => {
  const hashedPassword = await argon2.hash(input.password);
  const user: User = em.create(User, {
    ...input,
    password: hashedPassword
  })
  await em.persist(user).flush()
  const id = user.id
  const userOptions = em.create(Options, {
    userId: id
  })
  await em.persist(userOptions).flush()
  const token = signJwt(user.id)
  return { user, token };
}

export const loginUser = async (usernameOrEmail: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>, password: string) => {
  const user = await em.findOne(User, usernameOrEmail.includes("@")
    ? { email: usernameOrEmail }
    : { username: usernameOrEmail });
  if (!user) {
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
  return {
    token: signJwt(user.id),
    user
  }
}

export const changeUserPassword = async (newPassword: string, token: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>) => {
  if (newPassword.length <= 8) {
    return {
      errors: [
        {
          field: "newPassword",
          message: "length must be greater than 8",
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
  const jwtToken = signJwt(user.id)
  return { user, token: jwtToken };
}

export const forgotUserPassword = async (email: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>) => {
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