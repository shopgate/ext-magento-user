const TokenHandler = require('../helpers/tokenHandler')
const InvalidCredentialsError = require('../models/Errors/InvalidCredentialsError')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const clientCredentials = context.config.credentials
  const authUrl = context.config.magentoUrl + '/auth/token'
  const storages = context.storage
  const log = context.log
  const request = context.tracedRequest

  const strategy = input.strategy
  const userCredentials = input.parameters // should contain params ('login' and 'password') or 'code'

  const th = new TokenHandler(clientCredentials, authUrl, storages, log, request)

  // TODO: clarify if that is correct
  if (!_isValidStrategy(strategy)) {
    return cb(new Error('invalid login strategy'))
  }

  login(th, userCredentials, strategy, (err, magentoTokenResponse) => {
    if (err) {
      return cb(new InvalidCredentialsError('Invalid credentials were entered.'))
    }

    // delete token from device storage if it exists
    // TODO: initiate cart merging here by passing sth. to the next step
    th.deleteGuestTokens((err) => {
      if (err) return cb(err)
      cb(null, {userId: _getUserId(strategy, userCredentials), magentoTokenResponse})
    })
  })
}

/**
 *
 * @param {object} tokenHandler
 * @param {object} userCredentials
 * @param {string} strategy
 * @param {function} cb
 */
function login (tokenHandler, userCredentials, strategy, cb) {
  tokenHandler.login(userCredentials, strategy, (err, magentoTokenResponse) => {
    if (err) return cb(err)
    cb(null, magentoTokenResponse)
  })
}

/**
 *
 * @param string strategy
 * @return {boolean}
 * @private
 */
function _isValidStrategy (strategy) {
  const strategies = [
    'basic',
    'auth_code'
  ]

  return strategies.indexOf(strategy) > -1
}

/**
 *
 * @param {string} strategy
 * @param {object} userCredentials
 * @return {*}
 * @private
 */
function _getUserId (strategy, userCredentials) {
  switch (strategy) {
    case 'auth_code' :
      return userCredentials.code
    default :
      return userCredentials.login
  }
}
