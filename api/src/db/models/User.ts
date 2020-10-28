import { DataTypes, UUIDV4 } from "sequelize"
import db from "../database"

const User = db.sequelize.define("User", {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
  },
  appleAuth: {
    type: DataTypes.STRING,
  },
  googleAuth: {
    type: DataTypes.STRING,
  },
})


export default User

console.log(User === db.sequelize.models.User)