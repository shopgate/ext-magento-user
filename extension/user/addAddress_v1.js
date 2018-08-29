const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')
const mapper = require('../lib/mapper')

module.exports = async function (context, input) {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }
  const address = Object.assign(input.address)
  /** @var {MagentoAddress} newAddress */
  const newAddress = {
    firstname: address.firstName,
    lastname: address.lastName,
    postcode: address.zipCode,
    city: address.city,
    region: address.province,
    country_id: address.country,
    street: [
      address.street1,
      address.street2
    ],
    ...addCustomAttributes(address.customAttributes)
}

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`

  return await MagentoRequest.post(endpointUrl, context, input.token, newAddress, 'Request to Magento: addAddress')

  /**
   * @param {ShopgateAddressCustomAttributes} customAttributes
   * @return {Object}
   * @private
   */
  function addCustomAttributes(customAttributes) {
    let map = {}

    Object.keys(customAttributes).forEach(key => {
      const customAttributeCode = mapper.mapShopgatAttributeToMagentoAttribute(key)
      if (!map.hasOwnProperty(customAttributeCode)) {
        map[customAttributeCode] = customAttributes[key]
      }
    })

    return map
  }
}
