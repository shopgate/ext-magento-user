const TokenHandler = require('../helpers/tokenHandler')

module.exports = function (context, input, cb) {
  const clientCredentials = context.config.credentials
  const authUrl = context.config.magentoUrl + '/auth/token'
  const storages = context.storage
  const log = context.log
  const request = context.tracedRequest

  const response = input.magentoTokenResponse

  const th = new TokenHandler(clientCredentials, authUrl, storages, log, request)

  log.debug(`setting tokens ${response.tokens}`)
  th.setTokenInStorage('user', 'token', response.tokens, response.lifeSpan, (err) => {
    if (err) return cb(err)
    return cb(null, {})
  })
}
