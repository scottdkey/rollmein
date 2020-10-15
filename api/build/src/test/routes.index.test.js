"use strict";
process.env.NODE_ENV = "test";
var chai = require("chai");
var should = chai.should();
var chaiHttp = require("chai-http");
chai.use(chaiHttp);
var server = require("../server/index");
describe("routes : index", function () {
    describe("GET /", function () {
        it("should return json", function (done) {
            chai
                .request(server)
                .get("/")
                .end(function (err, res) {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.status.should.equal("success");
                res.body.message.should.eql("hello, world!");
                done();
            });
        });
    });
});
