const lodash = require('lodash')
const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param {Object} context
 * @param {Object} input
 */
module.exports = async (context, input) => {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/me`
  const magentoResponse = await MagentoRequest.send(endpointUrl, context, input.token, 'Request to Magento: getUser')

  const defaultProperties = {
    customer_id: 'id',
    firstname: 'firstName',
    lastname: 'lastName',
    email: 'mail'
  }

  return {
    ...mapDefaultAttributes(magentoResponse),
    ...mapCustomAttributes(magentoResponse),
    ...mapUserGroups(magentoResponse)
  }

  /**
   * @param {Object} magentoResponse
   * @return {Object}
   * @private
   */
  function mapDefaultAttributes (magentoResponse) {
    const result = {}
    Object.keys(magentoResponse).forEach((key) => {
      if (isDefaultProperty(key, magentoResponse)) {
        addDefaultProperty(result, key, magentoResponse)
      }
    })

    return result
  }

  /**
   * @param {Object} magentoResponse
   * @return {Object}
   * @private
   */
  function mapCustomAttributes (magentoResponse) {
    const result = {}
    Object.keys(magentoResponse).forEach((key) => {
      if (isCustomProperty(key, magentoResponse)) {
        addCustomProperty(result, key, magentoResponse)
      }
    })

    return result
  }

  /**
   * @param {String} key
   * @return {Boolean}
   * @private
   */
  function isDefaultProperty (key) {
    return lodash.hasIn(defaultProperties, key)
  }

  /**
   * @param {String} key
   * @return {Boolean}
   * @private
   */
  function isCustomProperty (key) {
    return !lodash.hasIn(defaultProperties, key) && key !== 'customer_group'
  }

  /**
   * @param {Object} result
   * @param {String} key
   * @param {Object} magentoResponse
   * @private
   */
  function addDefaultProperty (result, key, magentoResponse) {
    result[defaultProperties[key]] = magentoResponse[key]
  }

  /**
   * @param {Object} result
   * @param {String} key
   * @param {Object} magentoResponse
   * @private
   */
  function addCustomProperty (result, key, magentoResponse) {
    if (!lodash.hasIn(result, 'customAttributes')) {
      result.customAttributes = {}
    }
    result.customAttributes[key] = magentoResponse[key]
  }

  /**
   * @param {Object} magentoResponse
   * @private
   */
  function mapUserGroups (magentoResponse) {
    if (lodash.hasIn(magentoResponse, 'customer_group')) {
      return {
        ...{
          userGroups: [
            {
              id: magentoResponse.customer_group.customer_group_id,
              name: magentoResponse.customer_group.customer_group_code
            }
          ]
        }
      }
    }
  }
}
