const TokenHandler = require('../helpers/tokenHandler')

/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  TokenHandler.logout(context.storage, (err) => {
    if (err) return cb(err)
    cb(null, { success: true })
  })
}
