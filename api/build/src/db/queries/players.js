"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_js_1 = __importDefault(require("../connection.js"));
function getAllPlayers(user_id) {
    return connection_js_1.default("players").where({ user_id: user_id }).select("*");
}
function getSinglePlayer(user_id, id) {
    return connection_js_1.default("players").where({ user_id: user_id, id: id }).select("*");
}
function addPlayer(player) {
    return connection_js_1.default("players").insert(player).returning("*");
}
function updatePlayer(id, player) {
    return connection_js_1.default("players").update(player).where({ id: id }).returning("*");
}
function deletePlayer(id) {
    return connection_js_1.default("players").del().where({ id: id }).returning("*");
}
exports.default = {
    getAllPlayers: getAllPlayers,
    getSinglePlayer: getSinglePlayer,
    addPlayer: addPlayer,
    updatePlayer: updatePlayer,
    deletePlayer: deletePlayer,
};
