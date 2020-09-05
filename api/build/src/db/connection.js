"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var knexfile_js_1 = __importDefault(require("../../knexfile.js"));
var environment = process.env.NODE_ENV || "development";
var ENV_Config = knexfile_js_1.default[environment];
exports.default = knex_1.default(ENV_Config);
