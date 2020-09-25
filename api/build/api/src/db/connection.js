"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var knexfile_js_1 = __importDefault(require("../../knexfile.js"));
var currentEnv = process.env.NODE_ENV || "development";
var knexConfig = knexfile_js_1.default(currentEnv);
exports.default = knex_1.default(knexConfig);
