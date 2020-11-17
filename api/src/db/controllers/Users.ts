import { ParameterizedContext } from "koa"
import { User, UserInterface, userTable } from "../models/user"
import bcrypt from "bcryptjs";
import { query } from "..";

const saltAndHashPass = (password: string) => {
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(password, salt)
  return hash
}

const addUser = async (ctx: ParameterizedContext) => {
  const password = saltAndHashPass(ctx.request.body.password)
  const newUser = { ...ctx.request.body, password }
  const text = `INSERT INTO ${userTable}(email, username, password, apple_auth, google_auth)`
  const values = [newUser.email, newUser.username, newUser.password, newUser.apple_auth, newUser.google_auth]
  const result = await query(text, values).then(res => {
    console.log(res)
    return res.rows
  }).catch(e => {
    console.error(e)
  })
  console.log(result)
}

const getUser = async (uuid: string, done: any) => {
  await query(`SELECT * FROM ${userTable} WHERE id = $1`, [uuid])
    .then((res) => {
      done(null, res.rows);
    }
    )
    .catch((err: any) => {
      done(err, null);
    });
}

const checkUserPassword = async (email: string, password: string, done: any) => {
  return await query(`SELECT * FROM ${userTable} WHERE email = $1`, [email])
    .then((res) => {
      const user = res.rows[0]
      if (!user) return done(null, false);
      if (!comparePass(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err: any) => {
      return done(err);
    });
}

function comparePass(userPassword: string, databasePassword: string) {
  return bcrypt.compareSync(userPassword, databasePassword);
}


export { addUser, getUser, checkUserPassword }