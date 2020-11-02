"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const players_js_1 = __importDefault(require("../db/queries/players.js"));
const config_1 = __importDefault(require("../config"));
const router = new koa_router_1.default();
const BASE_URL = `${config_1.default.BASE_URL}/players`;
router.get(`${BASE_URL}/:uid`, async (ctx) => {
    const players = await players_js_1.default.getAllPlayers(ctx.params.uid);
    ctx.body = players;
});
router.get(`${BASE_URL}/:uid/:id`, async (ctx) => {
    try {
        const player = await players_js_1.default.getSinglePlayer(ctx.params.uid, ctx.params.id);
        if (player.length) {
            ctx.body = player;
        }
        else {
            ctx.status = 404;
            ctx.body = { error: { error: true, message: "That player was not found." } };
        }
    }
    catch (err) {
        console.log(err);
    }
});
router.post(`${BASE_URL}/:uid`, async (ctx) => {
    const newPlayer = { ...ctx.request.body, user_id: ctx.params.uid };
    try {
        const player = await players_js_1.default.addPlayer(newPlayer);
        if (player.length) {
            ctx.status = 201;
            ctx.body = player;
        }
        else {
            ctx.status = 406;
            ctx.body = "Player Query Error";
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err.message || "Sorry, an error has occurred.";
    }
});
router.put(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const player = await players_js_1.default.updatePlayer(ctx.params.id, ctx.request.body);
        if (player.length) {
            ctx.status = 200;
            ctx.body = player;
        }
        else {
            ctx.status = 404;
            ctx.body = "That player either doesn't exist or was not found.";
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err.message || "Sorry, an error has occurred";
    }
});
router.patch(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const player = await players_js_1.default.updatePlayer(ctx.params.id, ctx.request.body);
        if (player.length) {
            ctx.status = 200;
            ctx.body = player;
        }
        else {
            ctx.status = 404;
            ctx.body = "That player either doesn't exist or was not found.";
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err.message || "Sorry, an error has occurred";
    }
});
router.delete(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const player = await players_js_1.default.deletePlayer(ctx.params.id);
        if (player.length) {
            ctx.status = 200;
            ctx.body = player;
        }
        else {
            ctx.status = 404;
            ctx.body = "That player does not exist.";
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err.message || "Sorry, an error has occurred.";
    }
});
exports.default = router;
