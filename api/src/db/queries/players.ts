import knex from "../connection.js";

function getAllPlayers(user_id: number) {
  return knex("players").where({ user_id }).select("*");
}

function getSinglePlayer(user_id: number, id: number) {
  return knex("players").where({ user_id, id }).select("*");
}
function addPlayer(player: object) {
  return knex("players").insert(player).returning("*");
}

function updatePlayer(id: number, player: object) {
  return knex("players").update(player).where({ id }).returning("*");
}

function deletePlayer(id: number) {
  return knex("players").del().where({ id }).returning("*");
}

export default {
  getAllPlayers,
  getSinglePlayer,
  addPlayer,
  updatePlayer,
  deletePlayer,
};
