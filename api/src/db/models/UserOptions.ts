import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"
import { User } from "./User"

class UserOptions extends Model {
  public id!: number;
  public rollType!: string;
  public lockAfterOut!: boolean;
  public theme!: string;

}


UserOptions.init(
  {
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
  }, {
  tableName: "UserOptions",
  sequelize
})

UserOptions.belongsTo(User, { foreignKey: "user_id", targetKey: "id" })

export default UserOptions

export interface UserOptionsInterface {
  id: number;
  rollType: string;
  lockAfterOut: boolean;
  theme: string;
}