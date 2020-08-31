const knex = require("../connection");

function getAllPlayers(uid) {
  return knex("players").where({ user_id: uid }).select("*");
}

module.exports = {
  getAllPlayers,
};
