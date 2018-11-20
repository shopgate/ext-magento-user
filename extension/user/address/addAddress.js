const Unauthorized = require('../../models/Errors/Unauthorized')
const MagentoRequest = require('../../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new Unauthorized()
  }

  const request = new MagentoRequest(context, input.token)
  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`

  return request.post(endpointUrl, input.magentoAddress, 'Request to Magento: addAddress')
}
