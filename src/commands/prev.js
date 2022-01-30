const { SlashCommand } = require('slash-create')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'prev',
      description: 'Plays previous song from the queue',
      deferEphemeral: true,
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.eris = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    this.qm.getBack(ctx.guildID)
    this.qm.voiceEmit(ctx.guildID, 'vend', ctx)
  }
}

module.exports = Command
