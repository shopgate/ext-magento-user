const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @param {object} context
 * @param {object} input
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

  let userResponse = {}
  let customAttributes = {}

  let customerGroups = []
  if (magentoResponse.customer_group instanceof Object) {
    customerGroups.push(
      {
        id: magentoResponse.customer_group.customer_group_id,
        name: magentoResponse.customer_group.customer_group_code
      }
    )
  }

  Object.keys(magentoResponse).forEach((key) => {
    if (!addDefaultProperty(key)) {
      addCustomProperty(key)
    }
  })

  /**
   * Add custom Attributes
   */
  if (!isObjectEmpty(customAttributes)) {
    userResponse.customAttributes = customAttributes
  }

  /**
   * Add UserGroups
   */
  if (customerGroups.length) {
    userResponse.userGroups = customerGroups
  }

  return userResponse

  /**
   * @param {string} key
   * @return {boolean}
   * @private
   */
  function addDefaultProperty (key) {
    if (defaultProperties.hasOwnProperty(key) && typeof defaultProperties[key] === 'string') {
      userResponse[defaultProperties[key]] = magentoResponse[key]
      return true
    }
    return false
  }

  /**
   * @param {string} key
   * @return {boolean}
   * @private
   */
  function addCustomProperty (key) {
    if (key !== 'customer_group') {
      customAttributes[key] = magentoResponse[key]
      return true
    }
    return false
  }
  /**
   * @param {object} object
   * @return {boolean}
   * @private
   */
  function isObjectEmpty (object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
}
