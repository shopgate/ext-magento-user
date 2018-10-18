const Unauthorized = require('../../models/Errors/Unauthorized')
const MagentoRequest = require('../../lib/MagentoRequest')

module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new Unauthorized()
  }

  const request = new MagentoRequest(context, input.token)
  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`
  /** @type {MagentoAddress[]} */
  const magentoAddressResponse = await request.send(endpointUrl, 'Request to Magento: getAddresses')

  return {
    addresses: magentoAddressResponse.map(address => ({
      id: address.entity_id,
      firstName: address.firstname,
      lastName: address.lastname,
      ...getStreet(address.street),
      zipCode: address.postcode,
      city: address.city,
      province: address.region_code,
      country: address.country_id,
      tags: getTags(address),
      customAttributes: getCustomAttributes(address)
    }))
  }

  /**
   * @param {Array} street
   * @return {Object}
   * @private
   */
  function getStreet (street) {
    const map = street && {
      ...(street.length === 2 && { street2: street.pop() }),
      ...(street.length === 1 && { street1: street.pop() })
    }

    return map || {}
  }

  /**
   * @param {Object} address
   * @return {Array}
   * @private
   */
  function getTags (address) {
    const tags = []
    if (address.is_default_shipping) {
      tags.push('default_shipping')
    }
    if (address.is_default_billing) {
      tags.push('default_billing')
    }

    return tags
  }

  /**
   * @param {MagentoAddress} address
   * @return {ShopgateAddressCustomAttributes}
   * @private
   */
  function getCustomAttributes (address) {
    const customAttributes = {}
    customAttributes.middlename = address.middlename
    customAttributes.prefix = address.prefix
    customAttributes.suffix = address.suffix
    customAttributes.telephone = address.telephone
    customAttributes.fax = address.fax
    customAttributes.company = address.company
    customAttributes.vat_id = address.vat_id
    Object.keys(address.customAttributes).map((key) => {
      customAttributes[key] = address.customAttributes[key]
    })

    return customAttributes
  }
}
