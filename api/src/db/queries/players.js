const knex = require("../connection");

function getAllPlayers(user_id) {
  return knex("players").where({ user_id }).select("*");
}

function getSinglePlayer(user_id, id) {
  return knex("players").where({ user_id, id }).select("*");
}
function addPlayer(player) {
  return knex("players").insert(player).returning("*");
}

function updatePlayer(id, player) {
  return knex("players")
    .update(player)
    .where({ id: parseInt(id) })
    .returning("*");
}

function deletePlayer(id) {
  return knex("players")
    .del()
    .where({ id: parseInt(id) })
    .returning("*");
}

module.exports = {
  getAllPlayers,
  getSinglePlayer,
  addPlayer,
  updatePlayer,
  deletePlayer,
};
