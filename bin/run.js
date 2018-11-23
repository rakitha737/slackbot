'use strict'

const config = require('../config/index')
const slackClient = require('../server/slackClient')
const service = require('../server/service')
const http = require('http')
const server = http.createServer(service)

const witToken = config.witToken
const witClient = require('../server/witClient')(witToken)
const slackToken = config.slackToken

const slackLogLevel = 'info'

const serviceRegistry = service.get('serviceRegistry')
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry)
rtm.start()

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))

server.listen(3000)

server.on('listening', function() {
  console.log(
    `MicroService is listen on ${server.address().port} in ${service.get('env')}`
  )
})
