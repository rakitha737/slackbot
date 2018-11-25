module.exports = {
  apps: [
    {
      name: 'slackbot',
      script: 'bin/run.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'node',
      host: '18.224.1.150',
      ref: 'origin/master',
      repo: 'https://github.com/rakitha737/slackbot.git',
      path: '/srv/production',
      'post-deploy':
        'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production',
    },
  },
}
