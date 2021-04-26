const { SlashCommand, CommandOptionType } = require('slash-create')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'play',
      description: 'Adds a song to queue',
      options: [{
        type: CommandOptionType.STRING,
        name: 'song',
        description: 'Song url or query to search.',
        required: true,
      }],
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.client = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    ctx.defer()
    if (ctx.options.song.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
      this.qm.push(ctx.guildID, { url: ctx.options.song }, ctx, this.client.guilds.find((guild) => guild.id === ctx.guildID).members.find((user) => user.id === ctx.member.id), this.client.getChannel(ctx.channelID))
    } else {
      const results = await this.s.search('yt', ctx.options.song)

      if (results.length) {
        this.qm.push(ctx.guildID, { url: results[0].url }, ctx, this.client.guilds.find((guild) => guild.id === ctx.guildID).members.find((user) => user.id === ctx.member.id), this.client.getChannel(ctx.channelID))
      } else
        ctx.send('Search didn\'t return any results.')
    }
  }
}

module.exports = Command
