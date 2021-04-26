const { SlashCommand, CommandOptionType } = require('slash-create')
const { emit } = require('../models/guild.js')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'prev',
      description: 'Plays previous song from the queue',
      deferEphemeral: true,
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.client = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    this.qm.getBack(ctx.guildID)
    this.qm.voiceEmit(ctx.guildID, 'vend', ctx)
  }
}

module.exports = Command
