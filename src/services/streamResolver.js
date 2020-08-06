const Direct = require('./resolvers/direct.js')
const Youtube = require('./resolvers/youtube.js')
const D3S = require('./resolvers/d3s.js')
const Yandex = require('./resolvers/yandex.js')
const SoundCloud = require('./resolvers/soundcloud.js')

class StreamResolver {
  constructor () {
    this.direct = new Direct()
    this.youtube = new Youtube()
    this.d3s = new D3S()
    this.yandex = new Yandex()
    this.soundcloud = new SoundCloud()
  }

  async resolve (url) {
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/(.*)$/) || url.match(/^https?:\/\/(www.youtu.be|youtu.be)\/(.*)$/))
      return await this.youtube.resolve(url)
    else if (url.match(/^(http|https)?:\/\/(cloud.d3s.ru|d3s.ru)\/(open|d)\/(.*?)/))
      return await this.d3s.resolve(url)
    else if (url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)/))
      return await this.yandex.resolve(url)
    else if (url.match(/^https?:\/\/(www.soundcloud.com|soundcloud.com)\/(.*)$/))
      return await this.soundcloud.resolve(url)
    else if (url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
      return await this.direct.resolve(url)
    else return { invalid: true }
  }
}

module.exports = StreamResolver
