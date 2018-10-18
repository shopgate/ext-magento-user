const _ = {
  isNil: require('lodash/isNil'),
  omitBy: require('lodash/omitBy')
}
const Unauthorized = require('../models/Errors/Unauthorized')
const InvalidCall = require('../models/Errors/InvalidCall')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new Unauthorized()
  }

  if (_.isNil(input.firstName) && _.isNil(input.lastName) && _.isNil(input.customAttributes)) {
    throw new InvalidCall()
  }

  const request = new MagentoRequest(context, input.token)
  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}`
  const magentoUser = {
    firstname: input.firstName,
    lastname: input.lastName,
    ...input.customAttributes
  }

  return request.post(endpointUrl, _.omitBy(magentoUser, _.isNil), 'Request to Magento: updateUser')
}
