const { youtubeApiToken } = require("./config");

module.exports = {
  mode: '', // dev || prod
  tokens: {
    dev: '', // dev mode token
    prod: '' // production mode token
  },
  webhook: {
    id: '',
    token: ''
  },
  mongodb: {
    dev: '', // mongodb uri
    prod: ''
  },
  defaultPrefix: '',
  yandexCookie: '', // optional, register on yandex music to get 192 kbps music bitrate instead of 128
  youtubeApiToken: ''
}
