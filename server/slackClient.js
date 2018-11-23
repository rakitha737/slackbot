'use strict'

const { RTMClient } = require('@slack/client')

let rtm = null
let nlp = null
let registry = null
function handleOnAuthenticated(rtmStartData) {
  console.log(
    `Logged in as ${rtmStartData.self.name} of team ${
      rtmStartData.team.name
    }, but not connected`
  )
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', handler)
}

function handleOnMessage(rtmMessage) {
  if (rtmMessage.text.toLowerCase().includes('raki')) {
    nlp.ask(rtmMessage.text, (err, res) => {
      if (err) {
        console.log(err)
        return
      }

      try {
        if (
          !res.entities.intent ||
          !res.entities.intent[0] ||
          !res.entities.intent[0].value
        ) {
          throw new Error('Could not extract intent')
        }

        const intent = require('./intents/' + res.entities.intent[0].value + 'Intent')

        intent.process(res, registry, function(error, response) {
          if (error) {
            console.log(error.message)
            return
          }
          return rtm.sendMessage(response, rtmMessage.channel)
        })
      } catch (err) {
        console.log(err)
        console.log(res)
        rtm.sendMessage(
          "Sorry I don't know what you are taking about",
          rtmMessage.channel
        )
      }
    })
  }
}

module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
  nlp = nlpClient
  registry = serviceRegistry
  rtm = new RTMClient(token, {
    logLevel: logLevel,
  })
  addAuthenticatedHandler(rtm, handleOnAuthenticated)
  rtm.on('message', handleOnMessage)
  return rtm
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler
