import { DataTypes, UUIDV4, Model } from "sequelize"
import { sequelize } from "../database"
import { Player } from "./Player";


export class User extends Model {
  public id!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public appleAuth!: string;
  public googleAuth!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
export interface UserInterface {
  id: string;
  email: string;
  username: string;
  password: string;
  appleAuth: string;
  googleAuth: string;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
  username: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
  appleAuth: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },
  googleAuth: {
    type: new DataTypes.STRING(128),
    allowNull: true,
  },


}, {
  tableName: "users",
  sequelize
}

)

User.hasMany(Player, { foreignKey: "user_id", })


console.log(`User Model Matches sequelize Migration: ${User === sequelize.models.User}`)