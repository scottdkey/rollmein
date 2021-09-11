process.env.NODE_ENV = 'test'

import chai, { expect } from 'chai'
import { checkError, emailErrors, passwordErrors, usernameErrors, validateRegister } from '../utils/userHelpers'
import chaiHttp from "chai-http"

chai.use(chaiHttp)




describe('validateRegister tests', () => {
  const validationObject = { username: "test", password: "testing", email: "testing@testing.com" }
  it('Expect null if no errors found with login input', (done) => {
    const object = validateRegister(validationObject)
    expect(object).to.equal(null)
    done()
  })

  it('Expect username  length error', (done) => {
    const object = validateRegister({ ...validationObject, username: "te" })
    expect(object).to.not.equal(null)
    expect(object).to.eql([usernameErrors.lengthError])
    done()
  })
  it('Expect password length error', (done) => {
    const object = validateRegister({ ...validationObject, password: "te" })
    expect(object).to.not.equal(null)
    if (object) {
      expect(object[0]).to.eql(passwordErrors.lengthError)
    }
    done()
  })

  it('Expect error from no @ symbol', (done) => {
    const object = validateRegister({ ...validationObject, email: "test*test.com" })
    expect(object).to.not.equal(null)
    if (object) {
      expect(object[0]).to.eql(emailErrors.validEmail)
    }
    done()
  })

  it('Expect username to error with @ symbol', (done) => {
    const object = validateRegister({ ...validationObject, username: "test@" })
    expect(object).to.not.equal(null)
    if (object) {
      expect(object[0]).to.eql(usernameErrors.noAtSymbol)
    }
    done()
  })
})

describe(`checkError function tests`, () => {
  it("Expect unique email error", (done) => {
    const error = checkError(emailErrors.uniqueConstraint)
    expect(error).to.not.equal(null)
    if (error) {
      expect(error[0]).to.equal(emailErrors.unique)
    }
    done()
  })
  it("Expect unique username error", (done) => {
    const error = checkError(usernameErrors.uniqueConstraint)
    expect(error).to.not.equal(null)
    if (error) {
      expect(error[0]).to.equal(usernameErrors.unique)
    }
    done()
  })
})