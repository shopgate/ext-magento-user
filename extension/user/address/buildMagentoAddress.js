const mapper = require('../../lib/mapper')

module.exports = async (context, input) => {

  const address = Object.assign(input.address)
  /** @var {MagentoAddress} magentoAddress */
  const magentoAddress = {
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

  return {magentoAddress}

  /**
   * @param {ShopgateAddressCustomAttributes} customAttributes
   * @return {Object}
   * @private
   */
  function addCustomAttributes(customAttributes) {
    let map = {}

    Object.keys(customAttributes).forEach(key => {
      const customAttributeCode = mapper.mapShopgateAttributeToMagentoAttribute(key)
      if (!map.hasOwnProperty(customAttributeCode)) {
        map[customAttributeCode] = customAttributes[key]
      }
    })

    return map
  }
}
