"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
const database_1 = __importDefault(require("../database"));
const Player = database_1.default.sequelize.define("Player", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tank: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    dps: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    healer: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    locked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    in: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
});
Player.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "uuid" });
exports.default = Player;
