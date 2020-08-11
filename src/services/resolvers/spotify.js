const axios = require('axios')
const config = require('../../config.js')
const TokenService = require('../spotifyTokenService.js')
const Yandex = require('./yandex.js')

class Resolver {
  constructor () {
    this.tokenService = new TokenService()
    this.yandex = new Yandex()
  }

  async resolve(url) {
    const parsedUrl = (url + '/').match(/^https?:\/\/(open.spotify.com)\/(track|album)\/(.*?)\/(.*)/)
    if (parsedUrl[2] === 'track') return this.convert(parsedUrl[3])
    if (parsedUrl[2] === 'album') return this.convertAlbum(parsedUrl[3])
  }

  async convert (songId) {
    const info = await axios.get('https://api.spotify.com/v1/tracks/' + songId, {
      headers: {
        Authorization: 'Bearer ' + this.tokenService.token
      }
    })

    const yandexEqualients = await axios.get(`https://music.yandex.ru/handlers/music-search.jsx?text=${encodeURIComponent(info.data.artists[0].name + ' ' + info.data.name)}&type=tracks&lang=en`)
    let stream = (await this.yandex.resolve(`https://music.yandex.ru/album/${yandexEqualients.data.tracks.items[0].albums[0].id}/track/${yandexEqualients.data.tracks.items[0].id}`))[0]
    if (stream.invalid) return { invalid: true }

    stream.url = info.data.external_urls.spotify
    stream.source = 'Spotify'
    
    return [stream]
  }

  async convertAlbum (albumId) {
    const info = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: 'Bearer ' + this.tokenService.token
      }
    })

    const yandexCheckAlbum = await axios.get(`https://music.yandex.ru/handlers/music-search.jsx?text=${encodeURIComponent(info.data.artists[0].name + ' ' + info.data.name)}&type=albums&lang=en`)
    if (!yandexCheckAlbum.data.albums.items[0].id) return { invalid: true }

    // return await this.yandex.getAlbum(yandexCheckAlbum.data.albums.items[0].id)
    const yaTracks = await this.yandex.getAlbum(yandexCheckAlbum.data.albums.items[0].id)
    return yaTracks.map(track => Object.assign({}, track, { url: `https://open.spotify.com/track/${info.data.tracks.items[yaTracks.indexOf(track)].id}` }))
  }
}

module.exports = Resolver
