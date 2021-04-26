const { SlashCommand, CommandOptionType } = require('slash-create')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'next',
      description: 'Plays next song from the queue',
      guilds: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.client = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    this.qm.voiceEmit(ctx.guildID, 'vend', ctx)
  }
}

module.exports = Command
