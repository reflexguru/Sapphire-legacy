const axios = require('axios')

class Searcher {
  constructor () {}

  async search (query) {
    const res = (await axios.get(`https://music.yandex.ru/handlers/music-search.jsx?text=${encodeURIComponent(query)}&type=tracks&lang=en`)).data.tracks.items.splice(0, 10)

    return res.map(i => ({ artist: i.artists.map(a => a.name).join(', '), name: i.title, url: `https://music.yandex.ru/album/${i.albums[0].id}/track/${i.id}` }))
  }
}

module.exports = Searcher
