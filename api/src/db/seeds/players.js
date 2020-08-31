const { SEED_UID } = process.env;

exports.seed = function (knex) {
  return knex("players")
    .del()
    .then(() => {
      return knex("players").insert({
        name: "Emily",
        tank: false,
        dps: true,
        healer: true,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Tyler",
        tank: true,
        dps: true,
        healer: true,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Tyler",
        tank: true,
        dps: true,
        healer: true,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Kevin",
        tank: true,
        dps: true,
        healer: false,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Scott",
        tank: false,
        dps: true,
        healer: true,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Jordan",
        tank: false,
        dps: true,
        healer: false,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    })
    .then(() => {
      return knex("players").insert({
        name: "Jason",
        tank: true,
        dps: true,
        healer: true,
        locked: false,
        in: true,
        user_id: SEED_UID,
      });
    });
};
