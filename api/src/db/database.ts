import { Sequelize } from 'sequelize'
import keys from "../config/index"

export const envdb = (env: string) => {
  if (env === "production") {
    return keys.PROD_DB
  } else if (env === "test") {
    return keys.TEST_DB
  } else {
    return keys.DEV_DB
  }
}

export const sequelize = new Sequelize(
  envdb(keys.NODE_ENV),
  keys.PGUSER,
  keys.PGPASS,
  {
    host: keys.PGHOST,
    dialect: 'postgres',
    logging: false
  }
)



export const connect = async () => {
  try {
    await sequelize.authenticate().then(res => console.log("--Sequelize Connected--")).catch(err => console.log(err))
    await sequelize.sync()
    // console.log(`Connected to database: ${envdb(keys.NODE_ENV)}`)
  } catch (error) {
    console.error("Unable to connect:", error)
  }
}
export const disconnect = async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error("Error on disconnect:", error)
  }
}
