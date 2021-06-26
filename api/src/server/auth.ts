// import passport from 'koa-passport';
// import passportLocal from 'passport-local';
// // import passportFB from "passport-facebook";
// import { getUserByUUID, getUserByEmail, comparePass } from '../db/controllers/Users';

// const LocalStrategy = passportLocal.Strategy;
// // const FacebookStrategy = passportFB.Strategy;


// type User = {
//   id?: string;
// }
// const localStratOptions = { usernameField: 'email' };
// passport.serializeUser((user: User, done) => {
//   done(null, user.id)
// })
// passport.deserializeUser(async (uuid: string, done) => {
//   await getUserByUUID(uuid).then((user) => done(null, user)).catch(e => done(e, undefined))

// })
// passport.use(
//   new LocalStrategy(
//     localStratOptions,
//     async (username: string, password: string, done) => {
//       await getUserByEmail(username).then((user) => {
//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         } else if (user.password && !comparePass(password, user.password)) {
//           return done(null, false, { message: 'Incorrect password.' });
//         } else {
//           return done(null, user);
//         }
//       }).catch(e => {
//         return done(e);
//       })
//     }))