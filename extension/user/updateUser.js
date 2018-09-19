const _isNil = require('lodash/isNil')
const _omitBy = require('lodash/omitBy')
const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const InvalidCallError = require('../models/Errors/InvalidCallError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  if (_isNil(input.firstName) && _isNil(input.lastName) && _isNil(input.customAttributes)) {
    throw new InvalidCallError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}`
  const magentoUser = {
    firstname: input.firstName,
    lastname: input.lastName,
    ...input.customAttributes
  }

  return MagentoRequest.post(endpointUrl, context, input.token, _omitBy(magentoUser, _isNil), 'Request to Magento: updateUser')
}
