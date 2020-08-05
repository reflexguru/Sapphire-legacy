const axios = require('axios')

class Resolver {
  constructor () {}

  async resolve (link) {
    link = 'https://d3s.ru/d/' + (link + '/').replace(/^(http|https)?:\/\/(cloud.d3s.ru|d3s.ru)\/(open|d)\/(.*?)\/(|.*)/, '$4') + '/info'
    const res = await axios.get(link)
    if (!res.data || (!res.data.mime.startsWith('audio') && !res.data.mime.startsWith('video'))) return { invalid: true }
    const name = res.data.name
    const url = res.data.url
    const streamUrl = res.data.directUrl
    return {
      url,
      streamUrl,
      name,
      source: 'D3S Cloud'
    }
  }
}

module.exports = Resolver
