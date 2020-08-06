const axios = require('axios')
const qs = require('querystring')
const config = require('../config.js')

class TokenService {
  constructor () {
    this.token = null
    const self = this

    async function renew () {
      process.send({ name: 'debug', msg: 'Auto-getting spotify token...' })

      const res = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: 'Basic ' + config.spotifyToken
          }
        }
      )

      if (!res.data.access_token) {
        process.send({ name: 'error', msg: 'Failed to auto-renew spotify token, retrying in 10 seconds' })

        return setTimeout(renew, 10000)
      }

      self.token = res.data.access_token

      process.send({ name: 'debug', msg: 'Auto-renewing in 1 hour...' })

      setTimeout(renew, 3500000)
    }

    renew()
  }
}

module.exports = TokenService
