process.env.NODE_ENV = 'test'

import chai, { expect } from 'chai'
import { validateRegister } from '../utils/userHelpers'
// import chaiHttp from "chai-http"

// const should = Should()
// chai.use(chaiHttp)




describe('User Helper Functions Tests', () => {

  it('Expect null if no errors found with login input', (done) => {
    chai.should()
    const object = validateRegister({ username: "test", password: "testing", email: "testing@testing.com" })
    expect(object).to.be.null
    done()
  })
  // it('Expect error if username is too short', (done) => {

  //   const validatedInput = validateRegister({ username: "t", password: "testing", email: "testing@testing.com" })
  //   if (validatedInput) {
  //     expect(validatedInput[0].field).to.be(validUsernameLength.error.field)
  //     expect(validatedInput[0].message).to.be(validUsernameLength.error.message)
  //   }
  //   expect(validatedInput).not.to.be.null

  //   done()
  // })
})