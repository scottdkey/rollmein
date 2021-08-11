process.env.NODE_ENV = "test";

import { expect } from "chai"

describe("Sample Test", () => {
  it("should pass", (done) => {
    expect(1 + 1).to.equal(2)
    expect(15 + 16).to.equal(31)
    done()
  });
});
