const CommandTemplate = require('../classes/commandTemplate.js')
const Embed = require('../services/embedConstructor.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['инвайт', 'пригласить'],
      en: ['invite']
    }
  }

  get description () {
    return {
      ru: 'Отправляет ссылку на приглашение бота в ваш север',
      en: 'Sends bot invite link'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm, s, commands, guild) {
    let embed = new Embed()
      .color('#2f3136')
      .description('[Click to invite me!](https://discord.com/oauth2/authorize?client_id=518101066538024960&scope=bot&permissions=3148800)')
      .build()

    msg.channel.createMessage({ embed })
  }
}

module.exports = Command
