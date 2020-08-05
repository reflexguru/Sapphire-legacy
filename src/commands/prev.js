const CommandTemplate = require('../classes/commandTemplate.js')
const { emit } = require('../models/guild.js')

class Command extends CommandTemplate {
  get alias () {
    return {
      ru: ['пред', 'прев', 'н', '<'],
      en: ['prev', 'back', 'b', '<']
    }
  }

  get description () {
    return {
      ru: 'Включает предыдущую песню',
      en: 'Plays previous song'
    }
  }

  get permissions () {
    return []
  }

  async run (msg, sp, qm) {
    qm.getBack(msg.guildID)
    qm.voiceEmit(msg.guildID, 'setend')
  }
}

module.exports = Command
