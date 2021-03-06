const util = require('util')
const MagentoError = require('../models/Errors/MagentoEndpoint')
const InvalidCallError = require('../models/Errors/InvalidCall')
const RequestLogger = require('./RequestLogger')
const TOKEN_KEY = 'token'
/**
 * @class
 * @classdesc Handles all token related operations
 */
class TokenHandler {
  /**
   * @param {?StepContextCredentials} clientCredentials
   * @param {string} authUrl
   * @param {StepContextStorageContainer} storages
   * @param {StepContextLogger} log
   * @param {?Request} request
   * @param {?boolean} rejectUnauthorized
   *
   * @throws {InvalidCallError}
   */
  constructor (clientCredentials, authUrl, storages, log, request, rejectUnauthorized = true) {
    this.log = log
    this.requestLogger = new RequestLogger(log)
    this.storages = storages
    if (!request || !clientCredentials) {
      throw new InvalidCallError('request or client credentials are not defined')
    }

    this.request = request
    this.authUrl = authUrl
    this.username = clientCredentials.id
    this.password = clientCredentials.secret
    this.rejectUnauthorized = rejectUnauthorized
  }

  /**
   * @param {boolean} isLoggedIn
   * @param {StepCallback} cb
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
   * @private
   * @param {StepCallback} cb
   */
  _getGuestToken (cb) {
    this._getTokensFromStorage('device', TOKEN_KEY, (err, tokens) => {
      if (err) return cb(err)
      // If not in device storage || access expired
      if (!tokens || !tokens.accessToken) {
        // get token from magento by client credentials
        const options = {
          json: { 'grant_type': 'client_credentials' }
        }

        return this._getTokensFromMagento(options, (err, response) => {
          if (err) return cb(err)

          // if invalidating refresh token is disabled, we have to pass the former refresh token to the storage
          if (tokens && !response.refreshToken && tokens.refreshToken) {
            response.tokens.refreshToken = tokens.refreshToken
          }

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
   * @param {StepContextStorageContainer} storages
   * @param {function} cb
   */
  static logout (storages, cb) {
    storages.device.del(TOKEN_KEY, (err) => {
      if (err) return cb(err)
      cb()
    })
  }

  /**
   * @param {UserLoginInputParameters} userCredentials
   * @param {string} strategy
   *
   * @param {StepCallback} cb
   * @param {?Error} cb.err
   * @Param {?SgTokenData} cb.response
   */
  login (userCredentials, strategy, cb) {
    // get token from magento
    let jsonData = {}
    switch (strategy) {
      case 'basic' :
        jsonData = {
          'grant_type': 'password',
          'username': userCredentials.login,
          'password': userCredentials.password
        }
        break
      case 'facebook' : {
        jsonData = {
          'grant_type': 'facebook',
          'user_id': userCredentials.email
        }
        break
      }
      case 'auth_code' :
        jsonData = {
          'grant_type': 'authorization_code',
          'code': userCredentials.code
        }
        break
    }

    const options = {
      json: jsonData
    }

    this._getTokensFromMagento(options, (err, response) => {
      if (err) return cb(err)
      cb(null, response)
    })
  }

  /**
   * @private
   * @param {StepCallback} cb
   * @param {?Error} cb.err
   * @param {?{accessToken: string}} cb.accessToken
   */
  _getUserToken (cb) {
    this._getTokensFromStorage('device', TOKEN_KEY, (err, tokens) => {
      if (err) return cb(err)
      // user not logged in
      else if (!tokens) return cb(null, null)
      // if expired
      else if (!tokens.accessToken && tokens.refreshToken) {
        // use refresh token for new token
        const options = {
          json: {
            'grant_type': 'refresh_token',
            'refresh_token': tokens.refreshToken
          }
        }

        return this._getTokensFromMagento(options, (err, response) => {
          if (err) {
            this.log.error(err)
            return cb(null, null)
          }

          // if invalidating refresh token is disabled, we have to pass the former refresh token to the storage
          if (tokens && !response.refreshToken && tokens.refreshToken) {
            response.tokens.refreshToken = tokens.refreshToken
          }

          // write to device storage
          this.setTokenInStorage('device', TOKEN_KEY, response.tokens, response.lifeSpan, (err) => {
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
   * @private
   * @param {string} storage
   * @param {string} key
   * @param {StepCallback} cb
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
   * @param {string} storage
   * @param {string} key
   * @param {Object} tokens
   * @param {number} lifeSpan
   * @param {StepCallback} cb
   */
  setTokenInStorage (storage, key, tokens, lifeSpan, cb) {
    const tokenData = {
      tokens: tokens,
      expires: (new Date()).getTime() + lifeSpan * 1000
    }
    this.storages[storage].set(key, tokenData, (err) => {
      if (err) return cb(err)
      cb()
    })
  }

  /**
   * @typedef {Object} SgTokenData
   * @property {string} lifeSpan
   * @property {SgTokenDataToken} tokens
   */

  /**
   * @typedef {Object} SgTokenDataToken
   * @property {string} accessToken
   * @property {string} refreshToken
   */
  /**
   * @private
   * @param {Object} options
   * @param {StepCallback} cb
   * @param {?Error} cb.err
   * @param {?SgTokenData} cb.result
   */
  _getTokensFromMagento (options, cb) {
    const requestOptions = {
      url: this.authUrl,
      auth: {
        username: this.username,
        password: this.password
      },
      rejectUnauthorized: this.rejectUnauthorized,
      ...options
    }

    const requestStart = new Date()
    this.request.post(requestOptions, (err, res) => {
      if (err) return cb(err)
      if (res.statusCode !== 200) {
        this.log.error(`Got ${res.statusCode} from magento: ${JSON.stringify(res.body)}`)
        return cb(new MagentoError())
      }

      if (!res.body) {
        this.log.error(`Got an empty body from magento on token request with options: ${util.inspect(options, false, 3)}`)
        return cb(new MagentoError())
      }

      if (!res.body.access_token) {
        this.log.error(res, `Access token missing in response for request with options: ${util.inspect(options, false, 3)}`)
        return cb(new MagentoError())
      }

      const tokenData = {
        lifeSpan: res.body.expires_in,
        tokens: {
          accessToken: res.body.access_token,
          refreshToken: res.body.refresh_token // this is null in case of a guest token request
        }
      }

      this.requestLogger.log(res, requestOptions, requestStart, 'Request to Magento: tokenHandler')

      cb(null, tokenData)
    })
  }

  /**
   * @param {StepCallback} cb
   * @param {?Error} cb.err
   * @param {?Object} cb.result
   */
  deleteGuestTokens (cb) {
    this.storages.device.del(TOKEN_KEY, (err) => {
      if (err) return cb(err)
      cb()
    })
  }
}

module.exports = TokenHandler
