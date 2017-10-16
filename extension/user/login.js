const TokenHandler = require('../helpers/tokenHandler')

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
  const userCredentials = input.parameters // should contain params 'login' and 'password'

  const th = new TokenHandler(clientCredentials, authUrl, storages, log, request)

  // TODO: clarify if that is correct
  if (strategy !== 'basic') cb(new Error('invalid login strategy'))
  login(th, userCredentials, (err, magentoTokenResponse) => {
    if (err) return cb(err)
    // delete token from device storage if it exists
    // TODO: initiate cart merging here by passing sth. to the next step
    th.deleteGuestTokens((err) => {
      if (err) return cb(err)
      cb(null, {userId: userCredentials.login, magentoTokenResponse})
    })
  })
}

/**
 *
 * @param {object} tokenHandler
 * @param {object} userCredentials
 * @param {function} cb
 */
function login (tokenHandler, userCredentials, cb) {
  tokenHandler.login(userCredentials.login, userCredentials.password, (err, magentoTokenResponse) => {
    if (err) return cb(err)
    cb(null, magentoTokenResponse)
  })
}
