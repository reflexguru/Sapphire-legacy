const Direct = require('./resolvers/direct.js')
const Youtube = require('./resolvers/youtube.js')

class StreamResolver {
  constructor () {
    this.direct = new Direct()
    this.youtube = new Youtube()
  }

  async resolve (url) {
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/(.*)$/) || url.match(/^https?:\/\/(www.youtu.be|youtu.be)\/(.*)$/))
      return await this.youtube.resolve(url)
    else if (url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
      return await this.direct.resolve(url)
    else return { invalid: true }
  }
}

module.exports = StreamResolver
