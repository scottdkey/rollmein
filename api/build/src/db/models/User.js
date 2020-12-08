"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = exports.User = void 0;
const userTable = "users";
exports.userTable = userTable;
class User {
    constructor(params) {
        this.id = params.id;
        this.email = params.email;
        this.username = params.username;
        this.password = params.password;
        this.apple_auth = params.apple_auth;
        this.google_auth = params.google_auth;
        this.created_at = params.created_at;
        this.last_login = params.last_login;
    }
}
exports.User = User;
