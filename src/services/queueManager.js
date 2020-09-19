const Embed = require('./embedConstructor.js')
const StreamResolver = require('./streamResolver.js')
const Encoder = require('./encoder.js')

const axios = require('axios')
const ytdl = require('ytdl-core')

class QueueManager {
  constructor (client) {
    this.data = {}
    this.searchData = {}
    this.client = client
    this.resolver = new StreamResolver()
  }

  async push (serverId, data, msg, member) {
    if (!this.data[serverId]) this.data[serverId] = { list: [], current: 0 }
    this.data[serverId].channel = msg.channel.id

    let streamdata
    
    try {
      streamdata = await this.resolver.resolve(data.url)
    } catch (e) {
      msg.addReaction('dnd:525376389449252864')
      console.error(e)
    }

    if (streamdata.invalid) return msg.addReaction('dnd:525376389449252864')

    for (const stream of streamdata)
      this.data[serverId].list.push(stream)

    let m

    if (!this.data[serverId].voice) {
      await this.initConnection(serverId, member, msg.channel)
      this.play(serverId)
      m = await msg.channel.createMessage({
        embed: this.generateEmbed(streamdata[0])
      })
    } else m = await msg.addReaction('s_check:540623604505903124')

    if (this.data[serverId].message)
      this.client.deleteMessage(this.data[serverId].channel, this.data[serverId].message)

    this.data[serverId].message = m.id
  }

  async initConnection (serverId, member, channel) {
    this.data[serverId].voice = await this.client.joinVoiceChannel(member.voiceState.channelID, { opusOnly: true })
    this.data[serverId].voiceId = member.voiceState.channelID

    this.data[serverId].voice.on('setend', () => {
      this.data[serverId].voice.stopPlaying()
    })

    this.data[serverId].voice.on('end', async () => {
      this.data[serverId].current++

      if (this.data[serverId].message)
        this.client.deleteMessage(this.data[serverId].channel, this.data[serverId].message)

      if (
        this.data[serverId].current >= this.data[serverId].list.length ||
        this.data[serverId].current < 0
      ) {
        this.client.leaveVoiceChannel(this.data[serverId].voiceId)
        delete this.data[serverId]
      } else {
        this.play(serverId)
        this.data[serverId].message = (await channel.createMessage({
          embed: this.generateEmbed(this.data[serverId].list[this.data[serverId].current])
        })).id
      }
    })

    return
  }

  async play (serverId) {
    const data = this.data[serverId]

    const streamUrl = data.list[data.current].streamUrl
    let stream

    if (!data.list[data.current].noEncode) {
      const encoder = new Encoder(streamUrl)
      stream = await encoder.prepare()
    } else if (data.list[data.current].source === 'youtube')
      stream = ytdl('https://youtube.com/watch?v=' + data.list[data.current].ytId, { quality: '251', highWaterMark: 20971520 })
    else
      stream = (await axios.get(streamUrl, { responseType: 'stream' })).data

    data.voice.play(stream, {
      voiceDataTimeout: -1,
      format: 'webm'
    })
  }

  voiceEmit (serverId, event) {
    this.data[serverId].voice.emit(event)
  }

  generateEmbed (streamData) {
    return new Embed()
      .color('#2f3136')
      .description(
        (
          ( streamData.source === 'Spotify' && '<:spotify:743934452115439676>' ) ||
          ( streamData.source === 'Yandex.Music' && '<:yandex:743936341376761988>' ) ||
          ( streamData.source === 'soundcloud' && '<:soundcloud:743937076000587816>' ) ||
          ( streamData.source === 'youtube' && '<:youtube:743935149624000532>' ) || ''
        ) +
        '   **' + streamData.name + '**' +
        '\n' + streamData.url
      )
      .build()
  }

  getQueue (serverId) {
    return this.data[serverId]
  }

  getBack (serverId) {
    this.data[serverId].current -= 2
  }

  destroy (serverId) {
    this.data[serverId].current = -2
    this.data[serverId].voice.stopPlaying()
  }
}

module.exports = QueueManager
