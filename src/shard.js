const Base = require('eris-sharder').Base

// libraries
const mongoose = require('mongoose')
const fs = require('fs')

// services
const config = require('./config.js')
const QueueManager = require('./services/queueManager.js')
const CommandResolver = require('./services/commandResolver.js')
const StringProvider = require('./services/stringProvider.js')
const Searcher = require('./services/searcher.js')

class Sapphire extends Base {
  constructor (bot) {
    super(bot)
  }
 
  launch () {
    const client = this.bot
    const queueManager = new QueueManager(client)
    const commandResolver = new CommandResolver()
    const searcher = new Searcher()
    const commands = []

    process.send({ name: 'debug', msg: 'Loading commands to RAM...' })
    for (const cmd of fs.readdirSync('./src/commands')) {
      commands.push(new (require('./commands/' + cmd))(client))
    }
    process.send({ name: 'debug', msg: 'Done.' })

    client.editStatus('idle', { type: 2, name: config.defaultPrefix + 'help' })

    mongoose.connect(config.mongodb[config.mode], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        process.send({ name: 'error', msg: 'Failed to connect to mongodb, stopping shard...' })
        process.exit()
      } else process.send({ name: 'debug', msg: 'Connected to mongodb' })
    })

    client.on('messageCreate', async (msg) => {
      const { command, m, lang, guild } = await commandResolver.resolve(msg, commands) || {}

      if (!command) return

      command.run(m, new StringProvider(lang), queueManager, searcher, commands, guild)
    })

    client.on('messageReactionAdd', async (msg, emoji, userID) => {
      // will move this into separate file later

      if (userID === client.user.id) return

      if (!['🗑', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].includes(emoji.name)) return

      const emojiToInt = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

      msg.delete()

      if (emoji.name !== '🗑')
        queueManager.push(msg.guildID, { url: queueManager.searchData[msg.guildID].results[emojiToInt.indexOf(emoji.name)].url }, msg, msg.member.guild.members.find(mbr => mbr.id === userID))
    })
  }
}

module.exports = Sapphire
