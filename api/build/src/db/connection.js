"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
// @ts-ignore
const knexfile_js_1 = __importDefault(require("../../knexfile.js"));
const config_1 = __importDefault(require("../config"));
const knexConfig = knexfile_js_1.default(config_1.default.NODE_ENV || "development");
exports.default = knex_1.default(knexConfig);