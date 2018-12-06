const TokenHandler = require('../../helpers/tokenHandler')
const InvalidCredentialsError = require('../../models/Errors/InvalidCredentials')

/**
 * @typedef {Object} UserLoginInput
 * @property {string} strategy
 * @property  {UserLoginInputParameters} parameters
 */
/**
 * @typedef {{login: string, password: string}|{code: string}} UserLoginInputParameters - which one is passed is based on login strategy
 */
/**
 * @param {StepContext} context
 * @param {UserLoginInput} input
 *
 * @param {StepCallback} cb
 * @param {?Error} cb.error
 * @param {{userId: string}} cb.result
 */
module.exports = function (context, input, cb) {
  const clientCredentials = context.config.credentials
  const authUrl = context.config.magentoUrl + '/auth/token'
  const storages = context.storage
  const log = context.log
  const request = context.tracedRequest('magento-user-extension:login', { log: true })

  const strategy = input.strategy
  const userCredentials = input.parameters

  const th = new TokenHandler(clientCredentials, authUrl, storages, log, request, !context.config.allowSelfSignedCertificate)

  if (!_isValidStrategy(strategy)) {
    return cb(null, {})
  }

  login(th, userCredentials, strategy, (err, magentoTokenResponse) => {
    if (err) {
      return cb(new InvalidCredentialsError('Invalid credentials were entered.'))
    }

    // delete token from device storage if it exists
    th.deleteGuestTokens((err) => {
      if (err) return cb(err)
      cb(null, { userId: _getUserId(strategy, userCredentials), magentoTokenResponse })
    })
  })
}

/**
 * @param {TokenHandler} tokenHandler
 * @param {UserLoginInputParameters} userCredentials
 * @param {string} strategy
 *
 * @param {StepCallback} cb
 * @param {?Error} cb.error
 * @param {?object} cb.result
 */
function login (tokenHandler, userCredentials, strategy, cb) {
  tokenHandler.login(userCredentials, strategy, (err, magentoTokenResponse) => {
    if (err) return cb(err)
    cb(null, magentoTokenResponse)
  })
}

/**
 * @param {string} strategy
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
 * @param {string} strategy
 * @param {Object} userCredentials
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
