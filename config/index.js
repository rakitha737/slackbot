require('dotenv').config()

const bunyan = require('bunyan')

const log = {
  development:() => {
    return bunyan.createLogger({name: 'Slackbot-development', level:'debug'})
  },
  production: () => {
    return bunyan.createLogger({ name: 'Slackbot-production', level: 'debug' })
  },
  test: () => {
    return bunyan.createLogger({ name: 'Slackbot-test', level: 'fatal' })
  },
}

module.exports = {
  witToken: process.env.WIT_TOKEN,
  slackToken: process.env.SLACK_TOKEN,
  slackLogLevel: 'info',
  serviceTimeout: 30,
  slackBotApiToken: process.env.SLACK_BOT_API_TOKEN,
  // use npm package bunyan to generate custom logger
  // npm start | ./node_modules/.bin/bunyan to color coded messages
  log: (env) => {
    if (env) return log[env]()
    return log[process.env.NODE_ENV || 'development']()
  }
}
