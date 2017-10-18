const TokenHandler = require('../helpers/tokenHandler')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  const authUrl = context.config.magentoUrl + '/auth/token'
  const storages = context.storage
  const log = context.log

  const th = new TokenHandler(null, authUrl, storages, log, null)

  th.logout((err) => {
    if (err) return cb(err)
    cb(null, {success: true})
  })
}
