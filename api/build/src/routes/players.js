"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var players_js_1 = __importDefault(require("../db/queries/players.js"));
var config_1 = __importDefault(require("../../config"));
var router = new koa_router_1.default();
var BASE_URL = config_1.default.BASE_URL + "/players";
router.get(BASE_URL + "/:uid", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var players;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, players_js_1.default.getAllPlayers(ctx.params.uid)];
            case 1:
                players = _a.sent();
                ctx.body = players;
                console.log(ctx);
                return [2 /*return*/];
        }
    });
}); });
router.get(BASE_URL + "/:uid/:id", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var player, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, players_js_1.default.getSinglePlayer(ctx.params.uid, ctx.params.id)];
            case 1:
                player = _a.sent();
                if (player.length) {
                    ctx.body = player;
                }
                else {
                    ctx.status = 404;
                    ctx.body = { error: { error: true, message: "That player was not found." } };
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post(BASE_URL + "/:uid", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var newPlayer, player, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newPlayer = __assign(__assign({}, ctx.request.body), { user_id: ctx.params.uid });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, players_js_1.default.addPlayer(newPlayer)];
            case 2:
                player = _a.sent();
                if (player.length) {
                    ctx.status = 201;
                    ctx.body = player;
                }
                else {
                    ctx.status = 400;
                    ctx.body = "Something went wrong";
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                ctx.status = 400;
                ctx.body = err_2.message || "Sorry, an error has occurred.";
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put(BASE_URL + "/:id", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var player, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, players_js_1.default.updatePlayer(ctx.params.id, ctx.request.body)];
            case 1:
                player = _a.sent();
                if (player.length) {
                    ctx.status = 200;
                    ctx.body = player;
                }
                else {
                    ctx.status = 404;
                    ctx.body = "That player either doesn't exist or was not found.";
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                ctx.status = 400;
                ctx.body = err_3.message || "Sorry, an error has occurred";
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch(BASE_URL + "/:id", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var player, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, players_js_1.default.updatePlayer(ctx.params.id, ctx.request.body)];
            case 1:
                player = _a.sent();
                if (player.length) {
                    ctx.status = 200;
                    ctx.body = player;
                }
                else {
                    ctx.status = 404;
                    ctx.body = "That player either doesn't exist or was not found.";
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                ctx.status = 400;
                ctx.body = err_4.message || "Sorry, an error has occurred";
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete(BASE_URL + "/:id", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var player, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, players_js_1.default.deletePlayer(ctx.params.id)];
            case 1:
                player = _a.sent();
                if (player.length) {
                    ctx.status = 200;
                    ctx.body = player;
                }
                else {
                    ctx.status = 404;
                    ctx.body = "That player does not exist.";
                }
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                ctx.status = 400;
                ctx.body = err_5.message || "Sorry, an error has occurred.";
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
