const _ = {
  isNil: require('lodash/isNil'),
  omitBy: require('lodash/omitBy')
}
const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  if (_.isNil(input.firstName) && _.isNil(input.lastName) && _.isNil(input.customAttributes)) {
    throw new InvalidCallError()
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
