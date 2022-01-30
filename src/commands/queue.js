const { SlashCommand } = require('slash-create')
const Embed = require('../services/embedConstructor.js')
const config = require('../config.js')

class Command extends SlashCommand {
  constructor (creator, client, qm, s) {
    super(creator, {
      name: 'queue',
      description: 'Shows queue of tracks.',
      guildIDs: config.mode === 'dev' ? config.debugGuilds : null
    })

    this.eris = client
    this.qm = qm
    this.s = s
  }

  async run (ctx) {
    let queue = this.qm.getQueue(ctx.guildID)

    let queueString = `Queue length: ${queue.list.length}\n`
    let firstSong = queue.current - 5 < 0 ? 0 : queue.current - 5 > queue.list.length - 6 ? queue.list.length - 11 : queue.np - 5

    for (let i = 0; i < 10; i++) {
      if (queue.list[firstSong])
        queueString += `\n${firstSong == queue.current ? '**' : ''}${firstSong + 1}. ${queue.list[firstSong].name} ${firstSong == queue.current ? '< **' : ''}`
      
      firstSong++
    }

    ctx.send({
      embeds: [
        new Embed()
          .color('#2f3136')  
          .description(queueString)
          .build()
      ]
    })
  }
}

module.exports = Command
