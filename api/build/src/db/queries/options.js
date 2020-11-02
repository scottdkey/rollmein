"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_js_1 = __importDefault(require("../connection.js"));
function addUserOptions(uuid) {
    return connection_js_1.default("userOptions").insert({
        rollType: "FFA",
        lockAfterOut: false,
        theme: "dark",
    }).returning("*");
}
function getOptions(user_id, id) {
    return connection_js_1.default('userOptions').where({ user_id, id }).select("*");
}
function updateUserOptions(user_id, options) {
    return connection_js_1.default("userOptions").update(options).where({ user_id }).returning('*');
}
exports.default = {
    addUserOptions, updateUserOptions, getOptions
};
