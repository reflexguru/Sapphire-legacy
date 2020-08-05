const CommandTemplate = require('../classes/commandTemplate.js')
const Embed = require('../services/embedConstructor.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['очередь', 'оч', 'пл'],
      en: ['queue', 'q', 'pl']
    }
  }

  get description () {
    return {
      ru: 'Показывает очередь треков',
      en: 'Shows tracks queue'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm) {
    if (!msg.member.voiceState.channelID)
      return

    let queue = qm.getQueue(msg.guildId)

    let queueString = `${sp.get('queue')} **${msg.member.guild.name}**\n${sp.get('songsamount')}${queue.list.length}\n`
    let firstSong = queue.current - 5 < 0 ? 0 : queue.current - 5 > queue.list.length - 6 ? queue.list.length - 11 : queue.np - 5

    for (let i = 0; i < 10; i++) {
      if (queue.list[firstSong])
        queueString += `\n${firstSong == queue.current ? '**' : ''}${firstSong + 1}. ${queue.list[firstSong].name} ${firstSong == queue.current ? '< **' : ''}`
      
      firstSong++
    }

    msg.channel.createMessage({
      embed: new Embed()
        .color('#3399ff')  
        .description(queueString)
        .build()
    })
  }
}

module.exports = Command
