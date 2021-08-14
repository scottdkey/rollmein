import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Options } from "../entites/Options"
import { OptionsError, OptionsInput } from "../resolvers/options"



type validOptionsType = {
  error?: OptionsError,
  options?: Options
}

export async function updateOpts(userId: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>, input: OptionsInput) {
  const userOptions = await em.findOne(Options, { userId })
  if (userOptions) {
    const validOptionsorError = validateUserOptionsInput(userId, input, userOptions)
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

export async function createOpts(
  userId: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
): Promise<Options> {
  const options = em.create(Options, {
    userId
  })
  await em.persistAndFlush(options)
  return options
}

export async function getOpts(
  userId: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
): Promise<Options | null> {
  return await em.findOne(Options, {
    userId
  })
}

export async function deleteOpts(userId: string, em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>) {

  await em.nativeDelete(Options, {
    userId
  })
  return true
}

export const validateUserOptionsInput = (userId: string, input: OptionsInput | null, userOptions: Options): validOptionsType => {
  if (userId !== userOptions.userId) {
    return {
      error: {
        type: "authError",
        message: "not authorized to update"
      },
      options: undefined
    }

  } else if (input === null) {
    return {
      error: {
        type: "inputError",
        message: "null input recieved"
      },
      options: undefined
    }
  } else {
    userOptions.lockAfterOut = input.lockAfterOut
    userOptions.rollType = input.rollType
    userOptions.theme = input.theme
    return {
      error: undefined,
      options: userOptions
    }
  }

}