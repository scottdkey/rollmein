"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = __importDefault(require("../connection"));
function createDB(ENV) {
    if (ENV === test) {
        connection_1.default.raw;
    }
}
