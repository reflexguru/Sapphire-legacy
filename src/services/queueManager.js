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

    const streamdata = await this.resolver.resolve(data.url)
    this.data[serverId].list.push(streamdata)

    let m

    if (this.data[serverId].list.length === 1) {
      await this.initConnection(serverId, member, msg.channel)
      this.play(serverId)
      m = await msg.channel.createMessage({
        embed: this.generateEmbed(streamdata)
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
      stream = (await axios.get('https://d3s.ru/yt/' + data.list[data.current].ytId, { responseType: 'stream' })).data
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
      .color('#3399ff')
      .description(
        '**' + streamData.name + '**' +
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
