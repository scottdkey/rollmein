import knex from "../connection.js"



function addUserOptions(uuid: number) {
  return knex("userOptions").insert({
    rollType: "FFA",
    lockAfterOut: false,
    theme: "dark",
  }).returning("*")
}
function getOptions(user_id: number, id: number) {
  return knex('userOptions').where({ user_id, id }).select("*")
}


function updateUserOptions(user_id: number, options: object) {
  return knex("userOptions").update(options).where({ user_id }).returning('*')
}

export default {
  addUserOptions, updateUserOptions, getOptions
}