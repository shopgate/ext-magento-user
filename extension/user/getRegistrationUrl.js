/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  if (context.meta.userId) {
    return cb(new Error('user is logged in (getRegistrationUrl)'))
  }

  cb(null, {url: context.config.registrationUrl})
}
