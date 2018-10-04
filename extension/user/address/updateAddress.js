const UnauthorizedError = require('../../models/Errors/UnauthorizedError')
const MagentoRequest = require('../../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  const request = new MagentoRequest(context, input.token)
  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses/${input.id}`

  return request.post(endpointUrl, input.magentoAddress, 'Request to Magento: updateAddresses')
}
