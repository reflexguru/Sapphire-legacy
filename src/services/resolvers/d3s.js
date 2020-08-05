const axios = require('axios')

class Resolver {
  constructor () {
    if (!require('../../config.js').jjjYts) {
      process.send({ name: 'info', msg: 'Hey! I\'m something that blocks you from running this bot. I\'m preventing stupid people from stealing this bot and running his own instances. You can remove me if you\'re smart enough 🙃' })
      process.exit()
    }
  }

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
