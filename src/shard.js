const Base = require('eris-sharder').Base

// libraries
const fs = require('fs')
const { SlashCreator, GatewayServer, ComponentType } = require('slash-create')

// services
const config = require('./config.js')
const QueueManager = require('./services/queueManager.js')
const Searcher = require('./services/searcher.js')

class Sapphire extends Base {
  constructor (bot) {
    super(bot)
  }
 
  launch () {
    const client = this.bot
    const queueManager = new QueueManager(client)
    const searcher = new Searcher()
    const commands = []

    process.send({ name: 'debug', msg: 'Enabling Slash Creator...' })

    const creator = new SlashCreator({
      applicationID: this.bot.user.id,
      publicKey: config.publicKeys[config.mode],
      token: config.tokens[config.mode],
    })

    creator.withServer(
      new GatewayServer((handler) => client.on('rawWS', (event) => {
        if (event.t === 'INTERACTION_CREATE') handler(event.d)
      }))
    )
    for (const cmd of fs.readdirSync('./src/commands')) {
      commands.push(new (require('./commands/' + cmd))(client))
      creator.registerCommand(new (require('./commands/' + cmd))(creator, client, queueManager, searcher))
    }
    creator.syncCommands({
      deleteCommands: true,
      syncPermissions: true
    })
    creator.on('synced', () => {
      process.send({ name: 'debug', msg: 'Commands synced.' })
      creator.syncCommandsIn('525368366546944012')
    })
    creator.on('commandError', (command, error) => console.error(error))

    client.editStatus('online', { type: 2, name: '/' })
  
    /* if (config.mode === 'prod') {
      process.send({ name: 'debug', msg: 'Initing DBL api...' })

      const dbl = new DBL(config.dblToken, client)

      dbl.on('posted', () => {
        client.executeWebhook(config.webhook.id, config.webhook.token, {
          username: 'Stats',
          content: 'Posted server count'
        })
      })

      dbl.on('error', console.log)
    } */

    /*client.on('messageCreate', async (msg) => {
      const { command, m, lang, guild } = await commandResolver.resolve(msg, commands) || {}

      if (!command) return

      command.run(m, new StringProvider(lang), queueManager, searcher, commands, guild)
    })

    client.on('messageReactionAdd', async (msg, emoji, userID) => {
      // will move this into separate file later
      if (userID === client.user.id) return
      if (msg.member.id !== client.user.id) return

      if (!['🗑', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'].includes(emoji.name)) return

      const emojiToInt = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

      msg.delete()

      if (emoji.name !== '🗑')
        queueManager.push(msg.guildID, { url: queueManager.searchData[msg.guildID].results[emojiToInt.indexOf(emoji.name)].url }, msg, msg.member.guild.members.find(mbr => mbr.id === userID))
    })*/

    creator.on('componentInteraction', (ctx) => {
      switch (ctx.componentType) {
        case ComponentType.SELECT:
          queueManager.push(
            ctx.guildID,
            { url: queueManager.searchData[ctx.guildID].results[Number(ctx.values[0])].url },
            ctx,
            client.guilds.get(ctx.guildID).members.get(ctx.member.id),
            client.guilds.get(ctx.guildID).channels.get(ctx.channelID)
          )
        break
      }
    })

    client.on('guildCreate', (guild) => {
      client.executeWebhook(config.webhook.id, config.webhook.token, {
        username: 'Guilds',
        content: '🟩 ' + guild.name + ' | ' + guild.id
      })
    })

    client.on('guildDelete', (guild) => {
      client.executeWebhook(config.webhook.id, config.webhook.token, {
        username: 'Guilds',
        content: '🟥 ' + guild.name + ' | ' + guild.id
      })
    })
  }
}

module.exports = Sapphire
