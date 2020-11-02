"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connection_js_1 = __importDefault(require("../connection.js"));
function addUser(user) {
    const salt = bcryptjs_1.default.genSaltSync();
    const hash = bcryptjs_1.default.hashSync(user.password, salt);
    return connection_js_1.default("users")
        .insert({
        email: user.email,
        password: hash,
        username: user.username,
    })
        .returning("*");
}
function getAllUsers() {
    return connection_js_1.default("users").select("*");
}
exports.default = { addUser, getAllUsers };
