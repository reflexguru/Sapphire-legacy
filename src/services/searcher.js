const Youtube = require('./searchers/youtube.js')
const Yandex = require('./searchers/yandex.js')
const Soundcloud = require('./searchers/soundcloud.js')

class SearchService {
  constructor () {
    this.youtube = new Youtube()
    this.yandex = new Yandex()
    this.soundcloud = new Soundcloud()
  }

  async search (service, query) {
    if (service === 'yt')
      return await this.youtube.search(query)
    else if (service === 'ym')
      return await this.yandex.search(query)
    else if (service === 'sc')
      return await this.soundcloud.search(query)
    else return { invalid: true }
  }
}

module.exports = SearchService
