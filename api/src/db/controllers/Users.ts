import { ParameterizedContext } from "koa"
import { User, UserInterface, userTable } from "../models/user"
import bcrypt from "bcryptjs";
import { query } from "..";

const addUser = async (ctx: ParameterizedContext) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync();
  const hash: string = bcrypt.hashSync(password, salt)
  const newUser: UserInterface = new User({ ...ctx.request.body, password: hash })
  await query(`INSERT INTO ${userTable} (email, username, password, apple_auth, google_auth RETURNING *)`, [newUser.email, newUser.username, newUser.password, newUser.apple_auth, newUser.google_auth])
    .then(res => {
      const user = new User(res.rows[0])
      ctx.status = 201;
      ctx.body = user;
    }).catch((err: Error) => {
      console.log(err)
      ctx.error = err
    })
  return ctx
}

const getUser = async (uuid: string, done: any) => {
  await query(`SELECT * FROM ${userTable} WHERE id=$1`, [uuid]).then((res) => {
    const user: UserInterface = new User(res.rows[0])
    done(null, user);
  })
    .catch((err: any) => {
      done(err, null);
    });
}

const checkUserPassword = async (email: string, password: string, done: any) => {
  return await query(`SELECT * FROM ${userTable} WHERE email=$1`, [email])
    .then((res) => {
      const user = new User(res.rows[0])
      if (!user) return done(null, false);
      if (!comparePass(password, user.password!)) {
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