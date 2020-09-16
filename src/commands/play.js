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

  async run (msg, sp, qm, s) {
    if (!msg.args[0]) return msg.channel.createMessage(sp.get('nourl'))

    if (msg.args[0].match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
      qm.push(msg.guildID, { url: msg.args[0] }, msg, msg.member)
    else {
      const results = await s.search('yt', msg.args.join(' '))

      if (results.length)
        qm.push(msg.guildID, { url: results[0].url }, msg, msg.member)
      else
        msg.channel.createMessage(sp.get('cannotfind'))
    }
  }
}

module.exports = Command
