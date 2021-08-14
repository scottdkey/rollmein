import chai from 'chai'


describe('Hello Resolver Tests', () => {
  it('should add two numbers sucessfully', (done) => {
    chai.expect(2 + 2).to.equal(4)
    done()
  })
  it('should subtract two numbers sucessfully', (done) => {
    chai.expect(4 - 2).to.equal(2)
    done()
  })
  it('should multiply two numbers sucessfully', (done) => {
    chai.expect(4 * 4).to.equal(16)
    done()
  })
  it('should divide two numbers sucessfully', (done) => {
    chai.expect(4 / 2).to.equal(2)
    done()
  })
  //creating a test to fail to test pipeline
  it('should fail to do anyhing', (done) => {
    chai.expect(2 + 2).to.not.equal(16)
    done()
  })
})