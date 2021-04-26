const { youtubeApiToken } = require("./config");

module.exports = {
  mode: String, // dev || prod
  tokens: {
    dev: String, // dev mode token
    prod: String // production mode token
  },
  publicKeys: { // dev || prod
    dev: String,
    prod: String
  },
  webhook: {
    id: String,
    token: String
  },
  mongodb: {
    dev: String, // mongodb uri
    prod: String
  },
  defaultPrefix: String,
  yandexCookie: String, // optional, register on yandex music to get 192 kbps music bitrate instead of 128
  youtubeApiToken: String,
  soundcloudToken: String, // soundcloud client_id
  dblToken: String, // for posting stats in discord bot list
  audioSender: Number, // 0 - legacy local with ffmpeg, 1 - lavalink
}
