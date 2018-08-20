const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

module.exports = async function (context, input) {
  if (!context.meta || !context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/addresses`
  const magentoAddressResponse = await MagentoRequest.send(endpointUrl, context, input.token, 'Request to Magento: getAddresses')

  return {
    addresses: magentoAddressResponse.map(address => ({
      id: address.entity_id,
      firstName: _getValue(address.firstname),
      lastName: _getValue(address.lastname),
      street1: _getStreet(address.street, 'street1'),
      street2: _getStreet(address.street, 'street2'),
      zipCode: _getValue(address.postcode),
      city: _getValue(address.city),
      province: _getValue(address.region_id),
      country: _getValue(address.country_id),
      tags: _getTags(address),
      customAttributes: _getCustomAttributes(address)
    }))
  }

  /**
   * @param {Array} steetData
   * @param {string} type
   * @return {string | null}
   * @private
   */
  function _getStreet (steetData, type) {
    switch (type) {
      case 'street1':
        return _getValue(steetData.hasOwnProperty(0) ? steetData[0] : null)
      case 'street2':
        return _getValue(steetData.hasOwnProperty(1) ? steetData[1] : null)
      default:
        return null
    }
  }

  /**
   * @param {string | null} data
   * @return {string | undefined}
   * @private
   */
  function _getValue (data) {
    return data !== null ? data : undefined
  }

  /**
   * @param {Object} address
   * @return {Array | null}
   * @private
   */
  function _getTags (address) {
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
    customAttributes.middleName = _getValue(address.middlename)
    customAttributes.prefix = _getValue(address.prefix)
    customAttributes.suffix = _getValue(address.suffix)
    customAttributes.phone = _getValue(address.telephone)
    customAttributes.fax = _getValue(address.fax)
    customAttributes.company = _getValue(address.company)
    customAttributes.vatId = _getValue(address.vat_id)
    Object.keys(address.customAttributes).map((key) => {
      customAttributes[key] = _getValue(address.customAttributes[key])
    })
    return customAttributes
  }
}
