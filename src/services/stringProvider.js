class StringProvider {
  constructor (lang) {
    this.lang = lang
  }

  get (value) {
    return require('./languages/' + this.lang)[value]
  }
}

module.exports = StringProvider