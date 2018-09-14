const _ = require('lodash')
const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')
const mapper = require('../lib/mapper')

module.exports = async (context, input) => {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}`
  const magentoUser = {
    firstname: input.firstName,
    lastname: input.lastName,
    ...mapper.mapCustomUserAttributes(input.customAttributes || {})
  }

  return MagentoRequest.post(endpointUrl, context, input.token, _.omitBy(magentoUser, _.isNil), 'Request to Magento: updateUser')
}
