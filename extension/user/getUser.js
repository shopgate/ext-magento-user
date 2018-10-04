const _forEach = require('lodash/forEach')
const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param {Object} context
 * @param {Object} input
 */
module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/me`
  const magentoResponse = await MagentoRequest.send(endpointUrl, context, input.token, 'Request to Magento: getUser')

  const defaultProperties = {
    customer_id: 'id',
    firstname: 'firstName',
    lastname: 'lastName',
    email: 'mail',
    customer_group: []
  }

  return {
    ...mapAttributes(magentoResponse),
    ...mapUserGroups(magentoResponse)
  }

  /**
   * @param {MagentoResponseUser} magentoResponse
   * @return {Object}
   * @private
   */
  function mapAttributes (magentoResponse) {
    const result = { customAttributes: {} }
    _forEach(magentoResponse, (value, key) => {
      if (defaultProperties.hasOwnProperty(key)) {
        result[defaultProperties[key]] = value
      } else {
        result.customAttributes[key] = value
      }
    })

    return result
  }

  /**
   * @param {MagentoResponseUser} magentoResponse
   * @return {Object}
   * @private
   */
  function mapUserGroups (magentoResponse) {
    return (magentoResponse.hasOwnProperty('customer_group'))
      ? {
        userGroups: [
          {
            id: magentoResponse.customer_group.customer_group_id,
            name: magentoResponse.customer_group.customer_group_code
          }
        ]
      }
      : {}
  }
}
