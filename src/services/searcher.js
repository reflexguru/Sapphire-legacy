const Youtube = require('./searchers/youtube.js')

class SearchService {
  constructor () {
    this.youtube = new Youtube()
  }

  async search (service, query) {
    if (service === 'yt')
      return await this.youtube.search(query)
    else return { invalid: true }
  }
}

module.exports = SearchService
