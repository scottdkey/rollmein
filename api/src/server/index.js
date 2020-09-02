require("dotenv").config();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");
const RedisStore = require("koa-redis");

const indexRoutes = require("../routes/index");
const playerRoutes = require("../routes/players");
const userRoutes = require("../routes/users");
const authRoutes = require("../routes/auth");

const PORT = process.env.PORT || 1337;
const app = new Koa();

//sessions
app.keys = [process.env.SECRETKEY];
app.use(session({ store: new RedisStore() }, app));

//body parser
app.use(bodyParser());

//authentication
require("./auth");
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(indexRoutes.routes());
app.use(playerRoutes.routes());
app.use(userRoutes.routes());
app.use(authRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
