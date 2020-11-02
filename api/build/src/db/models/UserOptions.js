"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const User_1 = __importDefault(require("./User"));
const UserOptions = database_1.default.sequelize.define("UserOptions", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rollType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "FFA"
    },
    lockAfterOut: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    theme: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "dark",
    }
});
UserOptions.belongsTo(User_1.default, { foreignKey: "user_id", targetKey: "uuid" });
exports.default = UserOptions;
