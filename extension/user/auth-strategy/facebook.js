const InvalidCredentialsError = require('../../models/Errors/InvalidCredentialsError')


/**
 * Not implemented yet
 * @param {Object} context The connect context.
 * @param {Object} input The step input.
 * @returns {Promise}
 */
module.exports = async (context, input) => {
  if (input.strategy !== 'facebook') {
    return { }
  }

  context.log.error('Facebook strategy is not implemented')
  throw new InvalidCredentialsError()
}
