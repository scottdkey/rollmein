require("dotenv").config();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");

const indexRoutes = require("../routes/index");
const playerRoutes = require("../routes/players");
const userRoutes = require("../routes/users");

const PORT = process.env.PORT || 1337;

module.exports = new Koa()
  .use(bodyParser())
  .use(indexRoutes.routes())
  .use(playerRoutes.routes())
  .use(userRoutes.routes())
  .listen(PORT, () => console.log(`Rollmein API running on PORT: ${PORT}`));
