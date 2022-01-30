const prism = require('prism-media')
const axios = require('axios')

class Encoder {
  constructor (streamUrl) {
    this.streamUrl = streamUrl
  }

  async prepare () {
    const response = await axios.get(this.streamUrl, { responseType: 'stream' })
    console.log(this.streamUrl)

    const encoder = new prism.FFmpeg({
      args: [
        '-analyzeduration', '0',
        '-loglevel', '0',
        '-f', 'webm',
        '-c:a', 'libopus',
        '-ac', '2',
        '-b:a', '160k',
        '-vn'
      ]
    })

    return response.data.pipe(encoder)
  }
}

module.exports = Encoder
