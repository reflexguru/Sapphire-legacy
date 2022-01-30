const youtube = require('simple-youtube-api')
const yt = new youtube(require('../../config.js').youtubeApiToken)

class Searcher {
  constructor () {}

  async search (query) {
    const res = await yt.searchVideos(query, 25)

    return res.map(i => ({ artist: i.channel.title, name: i.title, url: i.url }))
  }
}

module.exports = Searcher
