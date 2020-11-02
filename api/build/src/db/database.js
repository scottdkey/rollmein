"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../config/index"));
const database = (env) => {
    if (env === "production") {
        return index_1.default.PROD_DB;
    }
    else if (env === "test") {
        return index_1.default.TEST_DB;
    }
    else {
        return index_1.default.PROD_DB;
    }
};
const sequelize = new sequelize_1.Sequelize(database(index_1.default.NODE_ENV), index_1.default.PGUSER, index_1.default.PGPASS, {
    host: index_1.default.PGHOST,
    dialect: 'postgres'
});
const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to Postgres has been established");
    }
    catch (error) {
        console.error("Unable to connect:", error);
    }
};
const disconnect = async () => {
    try {
        await sequelize.close();
    }
    catch (error) {
        console.error("Error on disconnect:", error);
    }
};
exports.default = { disconnect, connect, sequelize };
