import { DataTypes } from "sequelize"
import User from "./User"
import db from "../database"

const Player = db.sequelize.define("Player", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tank: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dps: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  healer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  in: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
})

Player.belongsTo(User, { foreignKey: "user_id", targetKey: "uuid" })

export default Player