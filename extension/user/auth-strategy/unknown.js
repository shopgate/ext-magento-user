const InvalidCallError = require('../../models/Errors/InvalidCallError')

/**
 * @param {Object} context The connect context.
 * @param {Object} input The step input
 * @return {Object}
 */
module.exports = async (context, input) => {
  if (!input.userId) {
    throw new InvalidCallError(`Unknown strategy '${input.strategy}': Login strategy is not implemented.`)
  }

  return {}
}
