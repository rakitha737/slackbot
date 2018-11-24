'use strict'

const request = require('superagent')
// function handleWitResponse(res) {
//   console.log(res)
// }

class WitClient {
  constructor(token) {
    this._token = token
  }

  ask(message, cb) {
    request
      .get('https://api.wit.ai/message')
      .set('Authorization', 'Bearer ' + this._token)
      .query({ v: '20181121' })
      .query({ q: message })
      .end((err, res) => {
        if (err) return cb(err)
        if (res.statusCode != 200)
          return cb('Expected status 200 but got ' + res.statusCode)

        // handleWitResponse(res.body)
        return cb(null, res.body)
      })
  }
}

module.exports = WitClient
