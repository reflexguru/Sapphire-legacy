const axios = require('axios')
const config = require('../../config.js')

class Resolver {
  constructor () {}

  async resolve (url) {
    if (url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)\/(album)\/(.*)\/(track)\/(.*)/)) {
      const id = url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)\/(album)\/(.*)\/(track)\/(.*)/)[5]
      return this.getTrack(id)
    } else if (url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)\/(album)\/(.*)/)) {
      const id = url.match(/^https?:\/\/(www.music.yandex.*|music.yandex.*)\/(album)\/(.*)/)[3]
      return this.getAlbum(id)
    }
  }

  async getTrack (trackId) {
    const info = await getTrackInfo(trackId)
    if (info.invalid) return { invalid: true }

    const url = await getDownloadServer(trackId)
    if (url.invalid) return { invalid: true }

    if (info && url)
      return [{
        url: `https://music.yandex.ru/album/${info.album}/track/${trackId}`,
        streamUrl: url,
        name: info.name,
        source: 'Yandex.Music'
      }]

    async function getTrackInfo (trackId) {
      let o = {
        method: 'get',
        url: `https://music.yandex.ru/api/v2.1/handlers/tracks?tracks=${trackId}&external-domain=music.yandex.ru&overembed=no&__t=${Date.now()}`,
        headers: {
          'accept': 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1',
          'X-Retpath-Y': `https%3A%2F%2Fmusic.yandex.ru%2Ftrack%2F${trackId}`,
          'Cookie': config.yandexCookie || ''
        }
      }
      let res = await axios(o)
      if (!res.data) return { invalid: true }

      return {
        name: res.data[0].artists[0].name + ' - ' + res.data[0].title,
        album: res.data[0].albums[0].id
      }
    }

    async function getDownloadServer (trackId) {
      let o = {
        method: 'get',
        url: `https://music.yandex.ru/api/v2.1/handlers/track/${trackId}/web-album_track-album-album-main/download/m?hq=0&external-domain=music.yandex.ru&overembed=no&q=1&__t=${Date.now()}`,
        headers: {
          'accept': 'application/json; q=1.0, text/*; q=0.8, */*; q=0.1',
          'X-Retpath-Y': `https%3A%2F%2Fmusic.yandex.ru%2Ftrack%2F${trackId}`,
          'Cookie': config.yandexCookie || ''
        }
      }
      let res = await axios(o)
      if (!res.data) return { invalid: true }

      o.url = res.data.src + '&format=json'
      res = await axios(o)
      if (!res.data) return { invalid: true }

      return `https://${res.data.host}/get-mp3/${res.data.s}/${res.data.ts}/${res.data.path}`
    }
  }

  async getAlbum (albumId) {
    const yandexGetTracks = await axios.get(`https://music.yandex.ru/handlers/album.jsx?album=${albumId}&lang=en&external-domain=music.yandex.ru&overembed=false`)
    if (!yandexGetTracks.data.volumes[0]) return { invalid: true }
    
    let streams = []
    for (const i in yandexGetTracks.data.volumes[0]) {
      let stream = (await this.getTrack(yandexGetTracks.data.volumes[0][i].id))[0]
      streams.push(stream)

      if (streams.length == yandexGetTracks.data.volumes[0].length) return streams
    }
  }
}

module.exports = Resolver
