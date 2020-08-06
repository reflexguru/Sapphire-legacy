const axios = require('axios')
const config = require('../../config.js')
const TokenService = require('../spotifyTokenService.js')

class Resolver {
  constructor () {
    this.tokenService = new TokenService()
  }

  async convert (url) {
    const songId = (url.split('/')[url.split('/').length - 1] + '?').split('?')[0]

    const info = await axios.get('https://api.spotify.com/v1/tracks/' + songId, {
      headers: {
        Authorization: 'Bearer ' + this.tokenService.token
      }
    })

    const yandexEqualients = await axios.get(`https://music.yandex.ru/handlers/music-search.jsx?text=${encodeURIComponent(info.data.artists[0].name + ' ' + info.data.name)}&type=tracks&lang=en`)

    return `https://music.yandex.ru/album/${yandexEqualients.data.tracks.items[0].albums[0].id}/track/${yandexEqualients.data.tracks.items[0].id}`
  }

  async convertAlbum (url) {
    const albumId = (url.split('/')[url.split('/').length - 1] + '?').split('?')[0]

    const info = await axios.get('https://api.spotify.com/v1/tracks/' + albumId, {
      headers: {
        Authorization: 'Bearer ' + this.tokenService.token
      }
    })

    process.send({ name: 'debug', msg: info })

    return []
  }
}

module.exports = Resolver
