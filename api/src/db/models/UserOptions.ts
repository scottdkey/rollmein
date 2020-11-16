import { DataTypes, Model } from "sequelize"
import { sequelize } from ".."
import { User } from "./user"

class UserOptions extends Model {
  public id!: number;
  public rollType!: string;
  public lockAfterOut!: boolean;
  public theme!: string;
  public userID!: string;

}
interface UserOptionsInterface {
  id: number;
  rollType: string;
  lockAfterOut: boolean;
  theme: string;
  userID: string;
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
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
  tableName: "UserOptions",
  sequelize
})

UserOptions.belongsTo(User, { foreignKey: "userId", targetKey: "id" })

export { UserOptions, UserOptionsInterface }

