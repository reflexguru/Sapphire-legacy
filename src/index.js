const config = require('./config.js')

const Sharder = require('eris-sharder').Master
new Sharder(config.tokens[config.mode], '/src/shard.js', {
  name: 'Sapphire',
  guildsPerShard: 500,
  stats: true,
  debug: true,
  webhooks: config.mode === 'prod' && {
    shard: {
      id: config.webhook.id,
      token: config.webhook.token
    }
  }
})
