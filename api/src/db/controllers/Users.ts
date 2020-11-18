import { DefaultContext, ParameterizedContext } from "koa"
import { User, UserInterface, userTable } from "../models/user"
import bcrypt from "bcryptjs";
import { query } from "..";

const getAllUsers = async () => {
  const { rows } = await query(`SELECT * FROM ${userTable};`, []
  )
  const Users = rows.map(user => {
    return new User(user)
  })
  return Users
}

const getUserByUUID = async (uuid: string) => {
  const values = [uuid]
  const text = `SELECT * FROM ${userTable} WHERE id=$1;`
  const { rows } = await query(text, values)
  return new User({ ...rows[0] })
}
const getUserByEmail = async (email: string) => {
  const values = [email]
  const text = `SELECT * FROM ${userTable} WHERE email=$1;`
  const { rows } = await query(text, values)
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
  console.log(booleanResponse)
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
    const { rows } = await query(text, values)
    const currentUser = new User({ ...rows[0] })
    ctx.body = { ...currentUser }
    ctx.status = 200
  }
  return ctx
}


function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}


export { addUser, getUserByUUID, getAllUsers, getUserByEmail, comparePass }