const Guild = require('../models/guild.js')
const config = require('../config.js')

class CommandResolver {
  constructor () {}

  async resolve (msg, commands) {
    if (msg.author.bot) return

    let guild

    if ( !(guild = await Guild.findOne({ id: msg.guildID }).select('prefix language').lean()) ) {
      // adding guild to db only if bot receives some message from it
      const preguild = new Guild({ id: msg.guildID, prefix: config.defaultPrefix, language: 'en' })
      guild = await preguild.save()
    }

    if (!msg.content.startsWith(guild.prefix)) return null

    const cmdName = msg.content.split(guild.prefix)[1].split(' ')[0]

    const command = commands.filter(i => i.alias[guild.language].includes(cmdName))[0]

    if (!command) return

    if (command.permissions.filter(perm => !msg.member.permission.has(perm)).length) {
      return msg.channel.createMessage(
        (
          (guild.language === 'en' && 'Missing permissions') ||
          (guild.language === 'ru' && 'Отсуствуют привилегии')
        ) + ': ' + command.permissions.filter(perm => !msg.member.permission.has(perm)).join(', ') + '.'
      )
    }

    msg.args = msg.content.split(' ').slice(1)

    return { command, m: msg, lang: guild.language, guild }
  }
}

module.exports = CommandResolver
