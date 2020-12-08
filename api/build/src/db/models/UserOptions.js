"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userOptionsTable = exports.UserOptions = void 0;
const userOptionsTable = "options";
exports.userOptionsTable = userOptionsTable;
class UserOptions {
    constructor(params) {
        this.id = params.id;
        this.rollType = params.rollType;
        this.lockAfterOut = params.lockAfterOut;
        this.theme = params.theme;
        this.userId = params.userId;
    }
}
exports.UserOptions = UserOptions;
