const CommandTemplate = require('../classes/commandTemplate.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['пинг'],
      en: ['ping']
    }
  }

  get description () {
    return {
      ru: 'Пингует бота',
      en: 'Pings bot'
    }
  }

  get permissions () {
    return []
  }

  async run (msg) {
    msg.addReaction('🏓')
  }
}

module.exports = Command
