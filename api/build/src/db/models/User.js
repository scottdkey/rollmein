"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const User = database_1.default.sequelize.define("User", {
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    appleAuth: {
        type: sequelize_1.DataTypes.STRING,
    },
    googleAuth: {
        type: sequelize_1.DataTypes.STRING,
    },
});
exports.default = User;
console.log(User === database_1.default.sequelize.models.User);
