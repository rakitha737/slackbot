'use strict'

const request = require('superagent')

module.exports.process = function process(intentData, registry, log, cb) {
  if (intentData.entities.intent[0].value !== 'time')
    return cb(
      new Error(`Expected time intent, got ${intentData.entities.intent[0].value}`)
    )
  if (!intentData.entities.location)
    return cb(new Error('Missing location in time intent'))

  const location = intentData.entities.location[0].value

  const service = registry.get('time')
  if (!service) return cb(false, 'No servive available')

  request
    .get(`http://${service.ip}:${service.port}/service/${location}`)
    .set('X-SLACK-SERVICE-API-TOKEN', service.accessToken)
    .end((err, res) => {
      if (err || res.statusCode != 200 || !res.body.result) {
        log.error(err)
        return cb(false, `I had problem finding out the time in ${location}`)
      }

      return cb(false, `In ${location}, It is now: ${res.body.result}`)
    })
}
