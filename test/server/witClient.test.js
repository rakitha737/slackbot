'use strict'

require('should')
const config = require('../../config')
const WitClient = require('../../server/witClient')

describe('witClient', () => {
  describe('ask', () => {
    it('should return a valid wit response', (done) => {
      const witClient = new WitClient(config.witToken)
      witClient.ask('What is the current time in Colombo', (err, response) => {
        if (err) return done(err)
        response.entities.intent[0].value.should.equal('time')
        response.entities.location[0].value.should.equal('Colombo')

        return done()
      })
    })
  })
})
