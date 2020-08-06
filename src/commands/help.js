const CommandTemplate = require('../classes/commandTemplate.js')
const Embed = require('../services/embedConstructor.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['хелп', 'помощь', 'команды'],
      en: ['help', 'commands', 'cmd']
    }
  }

  get description () {
    return {
      ru: 'Показывает список команд',
      en: 'Shows command list'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm, s, commands, guild) {
    let embed = new Embed()
      .color('#3399ff')

    let desc = sp.get('cmdlist') + '\n'

    for (const cmd of commands) {
      desc += '\n**' + guild.prefix + cmd.alias[sp.lang][0] + '** - ' + cmd.description[sp.lang]
    }

    embed = embed.description(desc).build()

    msg.channel.createMessage({ embed })
  }
}

module.exports = Command
