"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var connection_js_1 = __importDefault(require("../connection.js"));
function addUser(user) {
    var salt = bcryptjs_1.default.genSaltSync();
    var hash = bcryptjs_1.default.hashSync(user.password, salt);
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
exports.default = { addUser: addUser, getAllUsers: getAllUsers };
