import { DataTypes, Model } from "sequelize"
import { User } from "./User"
import { sequelize } from "../database"

export class Player extends Model {
  public id!: number;
  public playerName!: string;
  public tank!: boolean;
  public dps!: boolean;
  public healer!: boolean;
  public locked!: boolean;
  public in!: boolean;
  public user_id!: string;
}
export interface PlayerInterface {
  id: number;
  playerName: string;
  tank: boolean;
  healer: boolean;
  dps: boolean;
  locked: boolean;
  in: boolean;
  user_id: string;
}

Player.init(
  {
    id: {
      type: new DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    playerName: {
      type: new DataTypes.STRING(128),
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
    user_id: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  }, {
  tableName: "players",
  sequelize
})

Player.belongsTo(User, { foreignKey: "user_id", targetKey: "uuid" })



console.log(`Player Model Matches Migration: ${Player === sequelize.models.Player}`)