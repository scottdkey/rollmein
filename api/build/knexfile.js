"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var _a = process.env, PGPORT = _a.PGPORT, PGHOST = _a.PGHOST, PGPASS = _a.PGPASS, PGUSER = _a.PGUSER, DEV_DB = _a.DEV_DB, TEST_DB = _a.TEST_DB, PROD_DB = _a.PROD_DB;
function BaseConfig(environemntDB) {
    return {
        client: "pg",
        migrations: {
            directory: "./src/db/migrations",
        },
        seeds: {
            directory: "./src/db/seeds",
        },
        connection: {
            host: PGHOST,
            user: PGUSER,
            password: PGPASS,
            database: environemntDB,
            port: PGPORT,
        },
    };
}
exports.default = {
    test: BaseConfig(TEST_DB),
    development: BaseConfig(DEV_DB),
    production: BaseConfig(PROD_DB),
};
