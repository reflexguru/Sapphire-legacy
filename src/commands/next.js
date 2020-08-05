const CommandTemplate = require('../classes/commandTemplate.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['след', 'некст', '>'],
      en: ['next', 'n', '>']
    }
  }

  get description () {
    return {
      ru: 'Включает следующую песню',
      en: 'Plays next song'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm) {
    qm.voiceEmit(msg.guildID, 'setend')
  }
}

module.exports = Command
