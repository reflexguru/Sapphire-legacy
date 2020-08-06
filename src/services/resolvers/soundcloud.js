const axios = require('axios')
const config = require('../../config.js')

class Resolver {
  constructor () {}

  async resolve (url) {
    url = (url + '?').split('?')[0]

    const stream = await getTrack(url)
    if (stream.invalid) return { invalid: true }
    if (stream.streamUrl) return [stream]

    async function getTrack (track) {
      const link = 'https://api-v2.soundcloud.com/resolve?url=' + track + '&client_id=' + config.soundcloudToken
      const res = await axios.get(link)
      if (!res.data || res.data.length < 10) return { invalid: true }

      let stream = {}
      stream.streamUrl = await getStreamUrl(res.data.media.transcodings[1].url + '?client_id=' + config.soundcloudToken)
      stream.url = res.data.permalink_url
      stream.name = res.data.title
      stream.source = 'soundcloud'

      return stream
    }
    
    async function getStreamUrl (streamData) {
      const res = await axios.get(streamData)
      if (!res.data) return { invalid: true }
      
      return res.data.url
    }
  }
}

module.exports = Resolver
