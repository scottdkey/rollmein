require("dotenv").config();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.keys = [process.env.SECRETKEY];
// app.use(session({ store: new RedisStore()}, app)

app.use(bodyParser());

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

module.exports = server;
