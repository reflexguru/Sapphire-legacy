class CommandTemplate {
  constructor (client) {
    this.client = client
  }

  get permissions () {
    return []
  }
}

module.exports = CommandTemplate
