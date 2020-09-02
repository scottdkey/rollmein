

exports.seed = async(knex) => {
  const res = await knex('users')
  const SEED_UID = res[0].id
  return knex("players")
    .del()
    .then(() => {
      return knex("players").insert([
        {
          name: "Emily",
          tank: false,
          dps: true,
          healer: true,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Tyler",
          tank: true,
          dps: true,
          healer: true,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Kevin",
          tank: true,
          dps: true,
          healer: false,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Jill",
          tank: false,
          dps: true,
          healer: true,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Scott",
          tank: false,
          dps: true,
          healer: true,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Jordan",
          tank: false,
          dps: true,
          healer: false,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
        {
          name: "Jason",
          tank: true,
          dps: true,
          healer: true,
          locked: false,
          in: true,
          user_id: SEED_UID,
        },
      ]);
    });
};
