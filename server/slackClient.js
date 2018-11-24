'use strict'

const { RTMClient } = require('@slack/client')

class SlackClient {
  constructor(token, logLevel, nlp, registry, log) {
    this._rtm = new RTMClient(token, { logLevel: logLevel })
    this._nlp = nlp
    this._registry = registry
    this._log= log
    this._addAuthenticatedHandler(this._handleAuthenticated)
    this._rtm.on('message', this._handleOnMessage.bind(this))
  }

  _handleAuthenticated(rtmStartData) {
    this._log.info(
      `Logged in as ${rtmStartData.self.name} of team ${
        rtmStartData.team.name
      }, but not connected`
    )
  }

  _addAuthenticatedHandler(handler) {
    this._rtm.on('authenticated', handler.bind(this))
  }

  _handleOnMessage(rtmMessage) {
    if (rtmMessage.text.toLowerCase().includes('raki')) {
      this._nlp.ask(rtmMessage.text, (err, res) => {
        if (err) {
          this._log.error(err)
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

          intent.process(res, this._registry, this._log, (error, response) => {
            if (error) {
              this._log.error(error.message)
              return
            }
            return this._rtm.sendMessage(response, rtmMessage.channel)
          })
        } catch (err) {
          this._log.error(err)
          this._log.info(res)
          this._rtm.sendMessage(
            'Sorry I don\'t know what you are taking about',
            rtmMessage.channel
          )
        }
      })
    }
  }
  start(handler) {
    this._addAuthenticatedHandler(handler)
    this._rtm.start()

  }
}

module.exports = SlackClient
