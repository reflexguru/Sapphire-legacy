const axios = require('axios')
const config = require('../../config.js')

class Resolver {
  constructor () {}

  async resolve (link) {
    const id = link.split('track/')[1]

    const info = await getTrackInfo(id)
    if (info.invalid) return { invalid: true }

    const url = await getDownloadServer(id)
    if (url.invalid) return { invalid: true }

    if (info && url)
      return {
        url: link,
        streamUrl: url,
        name: info.name,
        source: 'Yandex.Music'
      }

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
        name: res.data[0].artists[0].name + ' - ' + res.data[0].title
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
}

module.exports = Resolver
