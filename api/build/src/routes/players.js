"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const Players_1 = require("../db/controllers/Players");
const keys_1 = __importDefault(require("../config/keys"));
const Player_1 = require("../db/models/Player");
const router = new koa_router_1.default();
//current route is /api/v1/players
router.prefix(`${keys_1.default.BASE_URL}/${Player_1.playerTable}`);
router.get(`/:uuid`, async (ctx) => ctx = await Players_1.getAllPlayers(ctx));
router.get(`/`, async (ctx) => ctx = await Players_1.getSinglePlayer(ctx));
router.post(`/`, async (ctx) => ctx = await Players_1.addPlayer(ctx));
router.put(`/`, async (ctx) => ctx = await Players_1.updatePlayer(ctx));
router.patch(`/`, async (ctx) => ctx = await Players_1.updatePlayer(ctx));
router.delete(`/`, async (ctx) => ctx = await Players_1.deletePlayer(ctx));
exports.default = router;
