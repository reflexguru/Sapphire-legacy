const CommandTemplate = require('../classes/commandTemplate.js')
const Embed = require('../services/embedConstructor.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['поиск', 'с'],
      en: ['search', 's']
    }
  }

  get description () {
    return {
      ru: 'Ищет песни',
      en: 'Searches for songs'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm, s) {
    if (!msg.args[0]) return msg.channel.createMessage(sp.get('noservice'))
    if (!msg.args.slice(1).join(' ')) return msg.channel.createMessage(sp.get('nosearchquery'))

    const service = msg.args[0]
    const query = msg.args.slice(1).join(' ')

    const results = await s.search(service, query)

    let embed = new Embed()
      .color('#3399ff')  

    for (const result of results) {
      embed = embed.field((results.indexOf(result) + 1) + '. ' + result.name, result.artist)
    }

    embed = embed.build()

    const m = await msg.channel.createMessage({ embed })

    qm.searchData[msg.guildID] = { msg: msg.id, results }

    try {
      await m.addReaction('🗑')
      await m.addReaction('1️⃣')
      await m.addReaction('2️⃣')
      await m.addReaction('3️⃣')
      await m.addReaction('4️⃣')
      await m.addReaction('5️⃣')
      await m.addReaction('6️⃣')
      await m.addReaction('7️⃣')
      await m.addReaction('8️⃣')
      await m.addReaction('9️⃣')
      await m.addReaction('🔟')
    } catch {} // catching rejections to keep logs clean
  }
}

module.exports = Command
