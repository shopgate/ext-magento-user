const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async function (context, input) {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`
  /** @type {MagentoAddress[]} */
  const magentoAddressResponse = await MagentoRequest.send(endpointUrl, context, input.token, 'Request to Magento: getAddresses')

  return {
    addresses: magentoAddressResponse.map(address => ({
      id: address.entity_id,
      firstName: getValue(address.firstname),
      lastName: getValue(address.lastname),
      ...getStreet(address.street),
      zipCode: getValue(address.postcode),
      city: getValue(address.city),
      province: getValue(address.region_id),
      country: getValue(address.country_id),
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
      ...(street.length === 2 && {street2: street.pop()}),
      ...(street.length === 1 && {street1: street.pop()})
    }

    return map || {}
  }

  /**
   * @param {string | boolean | number | null} data
   * @return {string | undefined}
   * @private
   */
  function getValue (data) {
    return data !== null ? data : undefined
  }

  /**
   * @param {Object} address
   * @return {Array | undefined}
   * @private
   */
  function getTags (address) {
    let tags = []
    if (address.is_default_shipping) {
      tags.push('default_shipping')
    }
    if (address.is_default_billing) {
      tags.push('default_billing')
    }

    return tags.length > 0 ? tags : undefined
  }

  /**
   * @param {MagentoAddress} address
   * @return {ShopgateAddressCustomAttributes}
   * @private
   */
  function getCustomAttributes (address) {
    let customAttributes = {}
    customAttributes.middleName = getValue(address.middlename)
    customAttributes.prefix = getValue(address.prefix)
    customAttributes.suffix = getValue(address.suffix)
    customAttributes.phone = getValue(address.telephone)
    customAttributes.fax = getValue(address.fax)
    customAttributes.company = getValue(address.company)
    customAttributes.vatId = getValue(address.vat_id)
    Object.keys(address.customAttributes).map((key) => {
      customAttributes[key] = getValue(address.customAttributes[key])
    })

    return customAttributes
  }
}
