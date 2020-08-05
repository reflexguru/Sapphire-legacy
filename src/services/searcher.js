const Youtube = require('./searchers/youtube.js')
const Yandex = require('./searchers/yandex.js')

class SearchService {
  constructor () {
    this.youtube = new Youtube()
    this.yandex = new Yandex()
  }

  async search (service, query) {
    if (service === 'yt')
      return await this.youtube.search(query)
    else if (service === 'ym')
      return await this.yandex.search(query)
    else return { invalid: true }
  }
}

module.exports = SearchService
