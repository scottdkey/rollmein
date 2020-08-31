require("dotenv").config();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");

const indexRoutes = require("../routes/index");
const playerRoutes = require("../routes/players");

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(bodyParser());

app.use(indexRoutes.routes());
app.use(playerRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server ready on port: ${PORT}`);
});

module.exports = server;
