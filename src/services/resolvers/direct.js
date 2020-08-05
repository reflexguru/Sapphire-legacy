const axios = require('axios')

class Resolver {
  constructor () {}

  async resolve (url) {
    return {
      streamUrl: url,
      url,
      name: decodeURI(url.split('/')[url.split('/').length - 1].split('?')[0]).split('+').join(' ').split('_').join(' '),
      source: 'direct url'
    }
  }
}

module.exports = Resolver
