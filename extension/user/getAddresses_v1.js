const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async function (context, input) {
  if (!context.meta || !context.meta.userId || !input.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`
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
      customAttributes: _getCustomAttributes(address)
    }))
  }

  /**
   * @param {Array} steetData
   * @param {string} type
   * @return {string | null}
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
   * @param {string | null} data
   * @return {string| boolean | numbers | undefined}
   * @private
   */
  function getValue (data) {
    return data !== null ? data : undefined
  }

  /**
   * @param {Object} address
   * @return {Array | null}
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

    return tags.length > 0 ? tags : null
  }

  /**
   * @param {Object} address
   * @return {Object}
   * @private
   */
  function _getCustomAttributes (address) {
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
