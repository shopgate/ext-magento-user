const UnauthorizedError = require('../../models/Errors/UnauthorizedError')
const InvalidCallError = require('../../models/Errors/InvalidCallError')
const MagentoRequest = require('../../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  if (!Array.isArray(input.ids)) {
    throw new InvalidCallError('Ids should be an array.')
  }

  if (!input.ids.length) {
    throw new InvalidCallError('No address ids given.')
  }

  if (input.ids.includes('')) {
    throw new InvalidCallError('Empty string address id passed.')
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses?ids=${input.ids.join(',')}`

  return MagentoRequest.delete(endpointUrl, context, input.token, input.magentoAddress, 'Request to Magento: deleteAddress')
}
