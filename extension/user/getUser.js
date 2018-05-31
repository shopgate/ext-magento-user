const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param {object} context
 * @param {object} input
 */
module.exports = async(context, input) => {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/me`
  const magentoResponse = await MagentoRequest.send(endpointUrl, context, input.token)

  return {
    id: magentoResponse.customer_id,
    mail: magentoResponse.email,
    firstName: magentoResponse.firstname,
    lastName: magentoResponse.lastname
  }
}
