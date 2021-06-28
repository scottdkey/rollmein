import db from "../index";
import { userTable } from "../entities/user";
import UserOptions, { UserOptionsInterface, userOptionsTable } from "../entities/userOptions"


interface UserOptionsDatabaseInterface {
  id: number,
  roll_type: string,
  lock_after_out: boolean,
  theme: string,
  user_id: string
}

const conformToUserOptions = (options: UserOptionsDatabaseInterface) => {
  return new UserOptions({
    id: options.id,
    rollType: options.roll_type,
    lockAfterOut: options.lock_after_out,
    theme: options.theme,
    userId: options.user_id
  })
}
const conformToDatabaseOptions = (options: UserOptionsInterface) => {
  const dbObject: UserOptionsDatabaseInterface = {
    id: options.id,
    roll_type: options.rollType,
    lock_after_out: options.lockAfterOut,
    theme: options.theme,
    user_id: options.userId
  }
  return dbObject
}

export const checkIfOptionsExist = async (uuid: string) => {
  const { rows } = await db.query(`SELECT user_id FROM ${userOptionsTable} WHERE user_id = $1`, [uuid])
  if (rows.length === 0) {
    return false
  } else if (rows[0].user_id === uuid) {
    return true
  } else {
    return false
  }
}


export const getOptionsByUUID = async (uuid: string) => {
  const { rows } = await db.query(`SELECT * FROM ${userOptionsTable} WHERE user_id = $1;`, [uuid])
  const userOptions = conformToUserOptions(rows[0])
  return userOptions
}

export const addUserOptions = async (uuid: string) => {
  const text = `INSERT INTO ${userOptionsTable}(user_id) VALUES($1) RETURNING *;`
  return await db.query(text, [uuid]).then(res => {
    const { rows } = res
    return conformToUserOptions(rows[0])
  }).catch(e => console.log(e))
}

export const updateUserOptions = async (o: UserOptionsInterface) => {
  const options = conformToDatabaseOptions(o)
  const text = `UPDATE ${userTable} SET roll_type = $1 lock_after_out = $2 theme = $3 WHERE id = $4`
  const values = [options.roll_type, options.lock_after_out, options.theme, options.id]
  const { rows } = await db.query(text, values)
  return conformToUserOptions(rows[0])
}