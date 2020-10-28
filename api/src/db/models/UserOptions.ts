import { DataTypes } from "sequelize"
import db from "../database"
import User from "./User"

const UserOptions = db.sequelize.define("UserOptions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rollType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "FFA"
  },
  lockAfterOut: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  theme: {
    type: DataTypes.STRING,
    defaultValue: "dark",
  }
})

UserOptions.belongsTo(User, { foreignKey: "user_id", targetKey: "uuid" })

export default UserOptions