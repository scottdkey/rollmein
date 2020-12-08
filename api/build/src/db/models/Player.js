"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerTable = exports.Player = void 0;
const playerTable = "players";
exports.playerTable = playerTable;
class Player {
    constructor(params) {
        this.id = params.id;
        this.player_name = params.player_name;
        this.tank = params.tank;
        this.healer = params.healer;
        this.dps = params.dps;
        this.locked = params.locked;
        this.in_the_roll = params.in_the_roll;
        this.user_id = params.user_id;
    }
}
exports.Player = Player;
