const Unauthorized = require('../models/Errors/Unauthorized')

/**
 * @typedef {object} input
 * @property {string} authSuccess
 * @property {string} authType
 *
 * @param context
 * @param input
 * @returns {*}
 */
module.exports = async (context, input) => {
  if (input.authSuccess !== true) {
    context.log.error(`Auth step finished unsuccessfully`)
    throw new Unauthorized('auth step was unsuccessful')
  }

  return {}
}
