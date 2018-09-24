const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async function (context, input) {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`

  return MagentoRequest.post(endpointUrl, context, input.token, input.magentoAddress, 'Request to Magento: addAddress')
}
