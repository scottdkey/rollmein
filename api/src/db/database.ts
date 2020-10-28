import { Sequelize } from 'sequelize'
import keys from "../config/index"

const database = (env: string) => {
  if (env === "production") {
    return keys.PROD_DB
  } else if (env === "test") {
    return keys.TEST_DB
  } else {
    return keys.PROD_DB
  }
}

const sequelize = new Sequelize(database(keys.NODE_ENV), keys.PGUSER, keys.PGPASS, {
  host: keys.PGHOST,
  dialect: 'postgres'
})


const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to Postgres has been established")
  } catch (error) {
    console.error("Unable to connect:", error)
  }
}
const disconnect = async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error("Error on disconnect:", error)
  }
}

export default { disconnect, connect, sequelize }