const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param {StepContext} context
 * @param {UpdateMailInput} input
 */
module.exports = async (context, input) => {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/email`

  return MagentoRequest.post(endpointUrl, context, input.token, { email: input.mail }, 'Request to Magento: updateMail')
}
