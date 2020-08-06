const axios = require('axios')
const config = require('../../config.js')

class Searcher {
  constructor () {}

  async search (query) {
    const res = (await axios.get(`https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${config.soundcloudToken}&limit=10&offset=0`)).data.collection

    return res.map(i => ({ artist: i.user.username, name: i.title, url: i.permalink_url }))
  }
}

module.exports = Searcher
