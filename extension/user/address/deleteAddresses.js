const Unauthorized = require('../../models/Errors/Unauthorized')
const InvalidCall = require('../../models/Errors/InvalidCall')
const MagentoCannotDeleteDefault = require('../../models/Errors/MagentoCannotDeleteDefault')
const MagentoEndpointNotAllowed = require('../../models/Errors/MagentoEndpointNotAllowed')
const MagentoRequest = require('../../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new Unauthorized()
  }

  if (!Array.isArray(input.ids)) {
    throw new InvalidCall('Ids should be an array.')
  }

  if (!input.ids.length) {
    throw new InvalidCall('No address ids given.')
  }

  if (input.ids.includes('')) {
    throw new InvalidCall('Empty string address id passed.')
  }

  const request = new MagentoRequest(context, input.token)
  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses?ids=${input.ids.join(',')}`

  try {
    await request.delete(endpointUrl, input.magentoAddress, 'Request to Magento: deleteAddress')
  } catch (error) {
    throw (error instanceof MagentoEndpointNotAllowed) ? new MagentoCannotDeleteDefault() : error
  }
}
