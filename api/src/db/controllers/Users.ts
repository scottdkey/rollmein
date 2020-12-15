import { ParameterizedContext } from "koa"
import User, { userTable } from "../models/user"
import bcrypt from "bcryptjs";
import db from "../";
import { addUserOptions } from "./UserOptions";

const getAllUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM ${userTable};`, []
  )
  const Users = rows.map(user => {
    return new User(user)
  })
  return Users
}

const addLastLoginTimeStamp = async (id: string) => {
  const currentTime = new Date().toISOString()
  const values = [id, currentTime]
  const text = `UPDATE ${userTable} SET last_login = $2 WHERE id = $1 RETURNING *;`
  const { rows } = await db.query(text, values)
  return new User({ ...rows[0] })
}

const getUserByUUID = async (uuid: string) => {
  const values = [uuid]
  const text = `SELECT * FROM ${userTable} WHERE id=$1;`
  const { rows } = await db.query(text, values)
  return new User({ ...rows[0] })
}
const getUserByEmail = async (email: string) => {
  const values = [email]
  const text = `SELECT * FROM ${userTable} WHERE email=$1;`
  const { rows } = await db.query(text, values)
  return new User({ ...rows[0] })
}

const saltAndHashPass = (password: string) => {
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(password, salt)
  return hash
}

const checkIfExistingUserByEmail = async (email: string) => {
  const res = await getUserByEmail(email)
  const booleanResponse = res.email! === email
  return booleanResponse
}
const addUser = async (ctx: ParameterizedContext) => {
  const password = saltAndHashPass(ctx.request.body.password)
  const newUser = new User({ ...ctx.request.body, password })
  const text =
    `INSERT INTO ${userTable}(email, password) VALUES($1, $2) RETURNING *;`
  const values = [newUser.email, newUser.password]
  const emailCheck = await checkIfExistingUserByEmail(newUser.email!)
  if (emailCheck) {
    ctx.throw(422, "Error, a user with this email address already exists")
  } else {
    const { rows } = await db.query(text, values)
    const currentUser = new User({ ...rows[0] })
    await addUserOptions(currentUser.id)
    ctx.body = { ...currentUser }
    ctx.status = 200
  }
  return ctx
}


function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}


export { addUser, getUserByUUID, getAllUsers, getUserByEmail, comparePass, addLastLoginTimeStamp }