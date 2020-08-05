const CommandTemplate = require('../classes/commandTemplate.js')
const Guild = require('../models/guild.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['префикс', 'пфкс'],
      en: ['prefix', 'pfx']
    }
  }

  get description () {
    return {
      ru: 'Изменяет префикс команд',
      en: 'Changes commands prefix'
    }
  }

  get permissions () {
    return ['administrator']
  }

  async run (msg, sp) {
    if (!msg.args[0]) return msg.channel.createMessage(sp.get('noprefix'))

    await Guild.updateOne({ id: msg.guildID }, { $set: { prefix: msg.args[0] } })

    return msg.channel.createMessage(sp.get('prefixchange') + ' **' + msg.args[0] + '**')
  }
}

module.exports = Command
