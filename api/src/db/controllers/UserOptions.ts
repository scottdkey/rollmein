

import { Next, ParameterizedContext } from "koa"
import { User } from "src/entites/User"
import { UserOptions } from "../../entites/UserOptions"


interface NewOptions {
  id: number,
  roll_type: string,
  lock_after_out: boolean,
  theme: string,
  user_id: string
}

interface UpdateOptions extends NewOptions {
  id: number,
}


export const getOptions = async (userId: string) => {
  return await UserOptions.findOne(userId)
}

export const addUserOptions = async (ctx: ParameterizedContext, next: Next) => {
  if (ctx.session) {
    const userId: string = ctx.session.userId
    const input: UserOptions = ctx.req ? ctx.req.input : 
    return await UserOptions({
      ...
    })

  }

}

export const updateUserOptions = async (o: UserOptionsInterface) => {
  const options = conformToDatabaseOptions(o)
  const text = `UPDATE ${userTable} SET roll_type = $1 lock_after_out = $2 theme = $3 WHERE id = $4`
  const values = [options.roll_type, options.lock_after_out, options.theme, options.id]
  const { rows } = await db.query(text, values)
  return conformToUserOptions(rows[0])
}