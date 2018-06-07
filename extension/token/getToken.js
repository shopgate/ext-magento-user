const TokenHandler = require('../helpers/tokenHandler')

/**
 *
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

  const isLoggedIn = !!context.meta.userId

  const th = new TokenHandler(clientCredentials, authUrl, storages, log, request, !context.config.allowSelfSignedCertificate)

  th.getToken(isLoggedIn, (err, token) => {
    if (err) return cb(err)
    cb(null, {token})
  })
}
