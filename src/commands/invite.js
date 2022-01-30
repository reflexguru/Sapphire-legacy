const { SlashCommand } = require('slash-create')
const Embed = require('../services/embedConstructor.js')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'invite',
      description: 'Gets an invite link of this bot.',
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.eris = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    const embed = new Embed()
      .color('#2f3136')
      .description('[Click to invite me!](https://discord.com/oauth2/authorize?client_id=518101066538024960&scope=bot&permissions=3148800)')
      .build()

    ctx.send({ embeds: [embed] })
  }
}

module.exports = Command
