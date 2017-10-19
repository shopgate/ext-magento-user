const Buffer = require('buffer').Buffer
const util = require('util')

const TOKEN_KEY = 'token'

class TokenHandler {
  constructor (clientCredentials, authUrl, storages, log, request) {
    this.clientCredentials = clientCredentials
    this.authUrl = authUrl
    this.log = log
    this.storages = storages
    this.request = request
  }

  /**
   * @param {boolean} isLoggedIn
   * @param {function} cb
   */
  getToken (isLoggedIn, cb) {
    if (isLoggedIn) {
      this.log.debug('trying to get token for user')
      return this._getUserToken((err, token) => {
        if (err) return cb(err)
        cb(null, token)
      })
    }

    this.log.debug('trying to get token for guest')
    this._getGuestToken((err, token) => {
      if (err) return cb(err)
      cb(null, token)
    })
  }

  /**
   *
   * @param {function} cb
   */
  _getGuestToken (cb) {
    this._getTokensFromStorage('device', TOKEN_KEY, (err, tokens) => {
      if (err) return cb(err)
      // If not in device storage || access expired
      if (!tokens || !tokens.accessToken) {
        // get token from magento by client credentials
        const options = {
          url: this.authUrl,
          json: { 'grant_type': 'client_credentials' },
          headers: { 'Authorization': `Basic ${Buffer.from(`${this.clientCredentials.id}:${this.clientCredentials.secret}`).toString('base64')}` }
        }

        return this._getTokensFromMagento(options, (err, response) => {
          if (err) return cb(err)
          // write to device storage
          this.setTokenInStorage('device', TOKEN_KEY, response.tokens, response.lifeSpan, (err) => {
            if (err) return cb(err)
            return cb(null, response.tokens.accessToken)
          })
        })
      }

      cb(null, tokens.accessToken)
    })
  }

  /**
   *
   * @param {function} cb
   */
  _getUserToken (cb) {
    this._getTokensFromStorage('user', TOKEN_KEY, (err, tokens) => {
      if (err) return cb(err)
      // user not logged in
      else if (!tokens) return cb(new Error('user is not logged in'))
      // if expired
      else if (!tokens.accessToken && tokens.refreshToken) {
        // use refresh token for new token
        const options = {
          url: this.authUrl,
          headers: { 'Authorization': `Basic ${Buffer.from(`${this.clientCredentials.id}:${this.clientCredentials.secret}`).toString('base64')}` },
          json: {
            'grant_type': 'refresh_token',
            'refresh_token': tokens.refreshToken
          }
        }

        return this._getTokensFromMagento(options, (err, response) => {
          if (err) return cb(err)
          // write to user storage
          this.setTokenInStorage('user', TOKEN_KEY, response.tokens, response.lifeSpan, (err) => {
            if (err) return cb(err)
            // return token
            return cb(null, response.tokens.accessToken)
          })
        })
      }

      cb(null, tokens.accessToken)
    })
  }

  /**
   *
   * @param {string} username
   * @param {string} password
   * @param {function} cb
   */
  login (username, password, cb) {
    // get token from magento
    const options = {
      url: this.authUrl,
      headers: { 'Authorization': `Basic ${Buffer.from(`${this.clientCredentials.id}:${this.clientCredentials.secret}`).toString('base64')}` },
      json: {
        'grant_type': 'password',
        'username': username,
        'password': password
      }
    }

    this._getTokensFromMagento(options, (err, response) => {
      if (err) return cb(err)
      cb(null, response)
    })
  }

  /**
   *
   * @param {function} cb
   */
  logout (cb) {
    this.storages.user.del(TOKEN_KEY, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  }

  /**
   *
   * @param {string} storage
   * @param {string} key
   * @param {function} cb
   */
  _getTokensFromStorage (storage, key, cb) {
    this.storages[storage].get(key, (err, tokenData) => {
      if (err) return cb(err)
      if (!tokenData || !tokenData.expires) return cb(null, null)
      if (tokenData.expires < (new Date()).getTime() - 60 * 1000) {
        this.log.debug('token is expired or will expire within the next minute')
        delete tokenData.tokens.accessToken
        return cb(null, tokenData.tokens)
      }

      cb(null, tokenData.tokens)
    })
  }

  /**
   *
   * @param {string} storage
   * @param {string} key
   * @param {object} tokens
   * @param {integer} lifeSpan
   * @param {function} cb
   */
  setTokenInStorage (storage, key, tokens, lifeSpan, cb) {
    const tokenData = {
      tokens: tokens,
      expires: (new Date()).getTime() + lifeSpan * 1000
    }
    this.storages[storage].set(key, tokenData, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  }

  /**
   *
   * @param {object} options
   * @param {function} cb
   */
  _getTokensFromMagento (options, cb) {
    this.log.debug(`sending: ${util.inspect(options, false, 3)} to magento auth endpoint`)
    this.request('Magento:tokens').post(options, (err, res, body) => {
      if (err) return cb(err)
      if (res.statusCode !== 200) return cb(new Error(`Got ${res.statusCode} from magento: ${JSON.stringify(body)}`))

      if (!(Array.isArray(body.success) && body.success.length === 1 && body.success[0].access_token)) {
        cb(new Error(`received invalid response from magento: ${JSON.stringify(body)}`))
      }

      const tokenData = {
        // TODO: structure is hopefully subject to change!
        lifeSpan: body.success[0].expires_in,
        tokens: {
          accessToken: body.success[0].access_token,
          // this is null in case of an guest token req
          refreshToken: body.success[0].refresh_token
        }
      }

      cb(null, tokenData)
    })
  }

  /**
   *
   * @param {function} cb
   */
  deleteGuestTokens (cb) {
    this.storages.device.del(TOKEN_KEY, (err) => {
      if (err) return cb(err)
      cb(null)
    })
  }
}

module.exports = TokenHandler
