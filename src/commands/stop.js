const CommandTemplate = require('../classes/commandTemplate.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['стоп', 'с'],
      en: ['stop', 's']
    }
  }

  get description () {
    return {
      ru: 'Останавливает воспроизведение',
      en: 'Stops playback'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm) {
    qm.destroy(msg.guildId)
    msg.addReaction('s_check:540623604505903124')
  }
}

module.exports = Command
