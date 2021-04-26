const Direct = require('./resolvers/direct.js')
const Youtube = require('./resolvers/youtube.js')
const D3S = require('./resolvers/d3s.js')
const Yandex = require('./resolvers/yandex.js')
const SoundCloud = require('./resolvers/soundcloud.js')
const Spotify = require('./resolvers/spotify.js')

const config = require('../config.js')

class StreamResolver {
  constructor () {
    this.direct = new Direct()
    this.youtube = new Youtube()
    this.d3s = new D3S()
    this.yandex = new Yandex()
    this.soundcloud = new SoundCloud()
    this.spotify = new Spotify()
  }

  async resolve (url, lava, serverId, member, msg) {
    const streams = await this.streamResolve(url)
    if (config.audioSender === 0)
      return streams
    else {
      const player = await lava.initConnection(serverId, member, msg.channel)
      let lavaStreams = []

      for (let i in streams) {
        const lavaTracks = await player.search(streams[i].streamUrl)

        for (const track of lavaTracks.tracks) {
          if (track.exception) {
            const embed = new Embed()
              .color('#2f3136')
              .description('Failed to load a song\n' + streams[i].url)
              .build()

            msg.channel.createMessage(embed)
          } else lavaStreams.push(Object.assign({}, streams[i], { lavaTrack: track }, track.title && track.title !== 'Unknown title' && { name: track.title }))
        }
      }

      return lavaStreams
    }
  }

  async streamResolve (url) {
    if (url.match(/^(http|https)?:\/\/(cloud.d3s.ru|d3s.ru)\/(open|d)\/(.*?)/))
      return await this.d3s.resolve(url)
    else if (url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)/))
      return await this.yandex.resolve(url)
    else if (url.match(/^https?:\/\/(open.spotify.com)\/(track|album)\/(.*?)/))
      return await this.spotify.resolve(url)
    else if (url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
      return await this.direct.resolve(url)
    //else return { invalid: true }
  }
}

module.exports = StreamResolver
