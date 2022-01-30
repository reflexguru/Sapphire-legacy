const { SlashCommand, CommandOptionType } = require('slash-create')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'stop',
      description: 'Stops playback.',
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.eris = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    this.qm.destroy(ctx.guildID)
    ctx.send('Stopped playback.')
  }
}

module.exports = Command
