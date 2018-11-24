'use strict'
//  "test": "set NODE_ENV=test eslint bin server && nyc mocha --recursive test",
require('should')
const request = require('supertest')
const config = require('../../config')
const service = require('../../server/service')(config)

describe('The express service', () => {
  describe('PUT/ foo', () => {
    it('should return HTTP 404', (done) => {
      request(service)
        .put('/foo')
        .expect(404, done)
    })
  })
})

describe('PUT /service/:intent/:port', () => {
  it('should return HTTP 200 with valid result', (done) => {
    request(service)
      .put('/service/test/9999')
      .set('X-SLACK-BOT-API-TOKEN', config.slackBotApiToken)
      .set('X-SLACK-SERVICE-API-TOKEN', 'Something')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        res.body.result.should.startWith('test at')
        return done()
      })
  })

  it('should return HTTP 403 with no API Token', (done) => {
    request(service)
      .put('/service/test/9999')
      .expect(403)
      .end(done)
  })

  it('should return HTTP 400 with no service Token provided', (done) => {
    request(service)
      .put('/service/test/9999')
      .set('X-SLACK-BOT-API-TOKEN', config.slackBotApiToken)
      .expect(400)
      .end(done)
  })
})
