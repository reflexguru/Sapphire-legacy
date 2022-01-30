const Embed = require('./embedConstructor.js')
const StreamResolver = require('./streamResolver.js')
const Encoder = require('./encoder.js')
const LavaPlayer = require('./lavaPlayer.js')

const config = require('../config.js')

const axios = require('axios')
const ytdl = require('ytdl-core')
const EventEmitter = require('events')

class QueueManager {
  constructor (client) {
    this.data = {}
    this.searchData = {}
    this.eris = client
    this.resolver = new StreamResolver()
    this.lavaplayer = new LavaPlayer(this.eris)

    this.lavaplayer.manager.on('queueEnd', (player) => {
      this.data[player.options.guild].voice.events.emit('vend')
    })

    this.lavaplayer.manager.on('trackError', (player) => {
      this.data[player.options.guild].textChannel.createMessage('Failed to load the current song')
      this.data[player.options.guild].voice.events.emit('vend')
    })

    this.lavaplayer.manager.on('socketClosed', (player) => {
      this.data[player.options.guild].current = -2
      this.data[player.options.guild].voice.events.emit('vend')
    })

    this.lavaplayer.manager.on('playerMove', (player, oldChannel, newChannel) => {
      this.data[player.options.guild].voiceId = newChannel
    })
  }

  async push (serverId, data, msg, member, channel) {
    if (!this.data[serverId]) this.data[serverId] = { list: [], current: 0 }
    this.data[serverId].channel = channel.id

    let streamdata
    
    try {
      streamdata = await this.resolver.resolve(data.url, this.lavaplayer, serverId, member, msg)
      msg.send({ embeds: [this.generateEmbed(streamdata[0], true)] })
    } catch (e) {
      msg.send('Song is unavailable.')
      console.error(e)
    }

    if (streamdata.invalid) return msg.send('Song is unavailable.')

    if (!streamdata.length) return

    for (const stream of streamdata)
      this.data[serverId].list.push(stream)

    let m = {}

    if (config.audioSender === 0 && !this.data[serverId].voiceState) {
      await this.initConnection(serverId, member, channel)
      this.data[serverId].voiceState = true
      this.play(serverId)
      m = await channel.createMessage({
        embed: this.generateEmbed(streamdata[0])
      })
    } else if (config.audioSender === 1 && !this.data[serverId].voiceState) {
      console.log(channel)
      const player = await this.lavaplayer.initConnection(serverId, member, channel.id)
      player.events = new EventEmitter()
      this.play(serverId, player)
      this.data[serverId].voice = player
      this.data[serverId].voiceState = true
      this.data[serverId].voiceId = member.voiceState.channelID
      this.data[serverId].textChannel = channel
      if (this.data[serverId].list.length > 1)
        m = await channel.createMessage({
          embed: this.generateEmbed(streamdata[0])
        })

      player.events.on('vend', async (ctx) => {
        this.data[serverId].current++
  
        if (this.data[serverId].message)
          this.eris.deleteMessage(this.data[serverId].channel, this.data[serverId].message)
  
        if (
          this.data[serverId].current >= this.data[serverId].list.length ||
          this.data[serverId].current < 0
        ) {
          await this.data[serverId].voice.destroy()
          delete this.data[serverId]
        } else {
          this.data[serverId].voiceState = false
          this.play(serverId, player)
          if (!ctx)
            this.data[serverId].message = (await channel.createMessage({
              embed: this.generateEmbed(this.data[serverId].list[this.data[serverId].current])
            })).id
          else
            ctx.send({
              embeds: [this.generateEmbed(this.data[serverId].list[this.data[serverId].current])]
            })
        }
      })
    } else msg.send({ embeds: [this.generateEmbed(streamdata[0], true)] })

    if (this.data[serverId].message)
      this.eris.deleteMessage(this.data[serverId].channel, this.data[serverId].message)

    this.data[serverId].message = m.id
  }

  async initConnection (serverId, member, channel) {
    this.data[serverId].voice = await this.eris.joinVoiceChannel(member.voiceState.channelID, { opusOnly: true })
    this.data[serverId].voiceId = member.voiceState.channelID

    this.data[serverId].voice.on('setend', () => {
      this.data[serverId].voice.stopPlaying()
    })

    this.data[serverId].voice.on('end', async () => {
      this.data[serverId].current++

      if (
        this.data[serverId].current >= this.data[serverId].list.length ||
        this.data[serverId].current < 0
      ) {
        this.eris.leaveVoiceChannel(this.data[serverId].voiceId)
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

  async play (serverId, player) {
    if (config.audioSender === 0)
      return this.legacyPlay(serverId)

    const data = this.data[serverId]
    const lavaTrack = this.data[serverId].list[this.data[serverId].current].lavaTrack

    player.play(lavaTrack)
  }

  async legacyPlay (serverId) {
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

  voiceEmit (serverId, event, ctx) {
    this.data[serverId].voice.events.emit(event, ctx)
  }

  generateEmbed (streamData, added) {
    return new Embed()
      .color('#2f3136')
      .footer(added ? 'Added to queue' : '')
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
    if (config.audioSender === 0) {
      this.data[serverId].current = -2
      this.data[serverId].voice.stopPlaying()
      this.data[serverId].voiceState = false
    } else {
      this.data[serverId].current = -2
      // this.data[serverId].list = []
      this.data[serverId].voice.events.emit('vend')
      // this.data[serverId].voiceState = false
      // delete this.data[serverId]
    }
  }
}

module.exports = QueueManager
