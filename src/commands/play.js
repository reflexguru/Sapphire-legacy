const CommandTemplate = require('../classes/commandTemplate.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['играй', 'игр', 'плей', 'п'],
      en: ['play', 'p']
    }
  }

  get description () {
    return {
      ru: 'Добавляет песню в очередь',
      en: 'Adds a song into queue'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm) {
    if (!msg.args[0]) return msg.channel.createMessage(sp.get('nourl'))

    qm.push(msg.guildID, { url: msg.args[0] }, msg, msg.member)
  }
}

module.exports = Command
