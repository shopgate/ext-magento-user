/**
 * @typedef {object} input
 * @property {string} authSuccess
 * @property {string} authType
 *
 * @param context
 * @param input
 * @param cb
 * @returns {*}
 */
module.exports = function (context, input, cb) {
  if (input.authSuccess !== true) {
    context.log.error(input.authType + ': Auth step finished unsuccessfully.')
    return cb(new Error('auth step was unsuccessful'))
  }

  return cb(null, {})
}
