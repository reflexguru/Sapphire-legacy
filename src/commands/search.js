const { SlashCommand, CommandOptionType } = require('slash-create')
const Embed = require('../services/embedConstructor.js')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'search',
      description: 'Searches songs and adds them to queue.',
      options: [{
        type: CommandOptionType.STRING,
        name: 'query',
        description: 'Query to search.',
        required: true
      }],
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.client = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    /*
      const service = msg.args[0]
      const query = msg.args.slice(1).join(' ')

      const results = await s.search(service, query)

      let embed = new Embed()
        .color('#2f3136')  

      for (const result of results) {
        embed = embed.field((results.indexOf(result) + 1) + '. ' + result.name, result.artist)
      }

      embed = embed.build()

      const m = await msg.channel.createMessage({ embed })

      qm.searchData[msg.guildID] = { msg: msg.id, results }
    */
    return 'This command will start working later.'
  }
}

module.exports = Command
