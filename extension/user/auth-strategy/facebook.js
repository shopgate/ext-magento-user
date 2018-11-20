const InvalidCredentialsError = require('../../models/Errors/InvalidCredentialsError')

/**
 * Not implemented yet
 * @param {StepContext} context The connect context.
 * @param {Object} input The step input.
 * @throws {InvalidCredentialsError}
 * @returns {Object}
 */
module.exports = async (context, input) => {
  if (input.strategy !== 'facebook') {
    return {}
  }

  context.log.error('Facebook strategy is not implemented')
  throw new InvalidCredentialsError()
}
