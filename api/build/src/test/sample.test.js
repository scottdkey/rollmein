"use strict";
process.env.NODE_ENV = "test";
describe("Sample Test", function () {
    it("should pass", function (done) {
        var sum = 1 + 2;
        sum.should.eql(3);
        sum.should.not.eql(4);
        done();
    });
});
