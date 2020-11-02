"use strict";
process.env.NODE_ENV = "test";
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const server = require("../server/index");
const knex = require("../db/connection");
const BASE_URL = `${process.env.BASE_API_URL}/players`;
const testUser = {
    email: "test@test.com",
    username: "Greg",
    password: "old'Greg",
};
describe("routes: players", () => {
    beforeEach(() => {
        return knex.migrate
            .rollback()
            .then(() => {
            return knex.migrate.latest();
        })
            .then(async () => {
            const UID = await knex("users").insert(testUser).returning("*").id;
            console.log(UID.id);
            return UID;
        })
            .then(() => {
            console.log(UID);
            process.env.SEED_UID = UID;
        })
            .then(() => {
            return knex.seed.run();
        });
    });
    afterEach(() => {
        knex("users").where({ id: USER_ID }).del();
        return knex.migrate.rollback();
    });
    describe(`GET ${BASE_URL}/:uid`, () => {
        it("should return all seeded players", (done) => {
            chai
                .request(server)
                .get(`${BASE_URL}`)
                .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.data.length.should.eql(7);
                res.body.data[0].should.include.keys("id", "name", "tank", "dps", "healer", "locked", "in", "user_id");
                res.body.data[5].name.should.eql("Jordan");
                res.body.data[2].healer.should.eql(false);
            });
        });
    });
});
