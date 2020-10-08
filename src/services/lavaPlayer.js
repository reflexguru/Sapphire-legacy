const { Manager } = require('erela.js')

class LavaPlayer {
  constructor (client) {
    this.manager = new Manager({
      nodes: [
        {
          host: 'localhost',
          port: 2333,
          password: 'youshallnotpass',
          secure: false
        }
      ],
      send (id, payload) {
        const guild = client.guilds.get(id)

        if (guild) guild.shard.sendWS(payload.op, payload.d)
      }
    })

    client.on('rawWS', (packet) => this.manager.updateVoiceState(packet))

    this.manager.init(client.user.id)

    this.manager
      .on('nodeConnect', () => console.log('New Lavalink node connected'))
      .on('nodeError', (node, error) => console.log(error))
  }

  async initConnection (serverId, member, channel, queueData) {
    let player

    if (player = this.manager.players.find(p => p.guild === serverId)) return player

    player = this.manager.create({
      guild: serverId,
      voiceChannel: member.voiceState.channelID,
      textChannel: channel.id,
      selfDeafen: true
    })

    player.connect()

    return player
  }
}

module.exports = LavaPlayer
