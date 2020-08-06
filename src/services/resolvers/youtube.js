const ytdl = require('ytdl-core')

class Resolver {
  constructor () {}

  async resolve (url) {
    const id = ytdl.getVideoID(url)
    const info = await ytdl.getInfo(id)
    const data = {
      url,
      name: info.videoDetails.title,
      noEncode: true,
      source: 'youtube',
      ytId: id
    }

    return [data]
  }
}

module.exports = Resolver
