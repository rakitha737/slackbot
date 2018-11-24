'use strict'

const request = require('superagent')

module.exports.process = function process(intentData, registry, cb) {
  if (intentData.entities.intent[0].value !== 'weather')
    return cb(
      new Error(`Expected weather intent, got ${intentData.entities.intent[0].value}`)
    )
  if (!intentData.entities.location)
    return cb(new Error('Missing location in weather intent'))

  const location = intentData.entities.location[0].value

  const service = registry.get('weather')
  if (!service) return cb(false, 'No servive available')

  request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
    if (err || res.statusCode != 200 || !res.body.result) {
      // console.log(err)
      return cb(false, `I had problem finding out the weather in ${location}`)
    }

    return cb(false, `The current weather in ${location} is ${res.body.result}`)
  })
}
