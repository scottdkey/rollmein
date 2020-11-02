"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const options_1 = __importDefault(require("../db/queries/options"));
const config_1 = __importDefault(require("../config"));
const router = new koa_router_1.default();
const BASE_URL = `${config_1.default.BASE_URL}/options`;
router.get(`${BASE_URL}/:uid/:id`, async (ctx) => {
    const options = await options_1.default.getOptions(ctx.params.uid, ctx.params.id);
    if (options.length) {
        ctx.body = options;
    }
    else {
        ctx.status = 404;
        ctx.body = "An error has occurred, that options object was not found";
    }
});
router.put(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const options = await options_1.default.updateUserOptions(ctx.params.id, ctx.request.body);
        if (options) {
            ctx.status = 200;
            ctx.body = options;
        }
        else {
            ctx.status = 406;
            ctx.body = "An error has occured. That Options object was not updated";
        }
    }
    catch (err) {
        ctx.status = 400;
        ctx.body = err.message || "Sorry, a generic error has occurred";
    }
});
exports.default = router;
