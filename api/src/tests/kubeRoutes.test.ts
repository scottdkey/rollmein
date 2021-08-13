process.env.NODE_ENV = 'test'


import chai, { should as Should } from 'chai'
import chaiHttp from "chai-http"
import { server } from "../index"

const should = Should()
chai.use(chaiHttp)

describe('Kubernetes routes tests', () => {
  it('should return live container endpoint', (done) => {
    chai
      .request(server)
      .get('/live')
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200);
        res.type.should.equal('application/json')
        res.body.message.should.equal("Currently Running")
        done()
      })
  })
  it('should return container health endpoint', (done) => {
    chai
      .request(server)
      .get(`/health`)
      .end((err, res) => {
        should.not.exist(err)
        res.status.should.equal(200);
        res.type.should.equal('application/json')
        res.body.message.should.equal("Currently Healthy")
        done()
      })
  })
})