"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var __1 = __importDefault(require("../../"));
var staticPages = new koa_1.default();
staticPages.use(__1.default("../../web/build"));
exports.default = staticPages;
