const moment = require('moment')

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
  const magentoResponse = await MagentoRequest.send(endpointUrl, context, input.token, )
  let addresses = []

  // will be only returned with cloudapi plugin >= 3.1.4
  if (magentoResponse.addresses) {
    magentoResponse.addresses.forEach((address) => {
      addresses.push({
        id: address.customer_address_id,
        type: address.is_default_billing === true ? 'invoice' : 'shipping',
        firstName: address.firstname,
        lastName: address.lastname,
        company: address.company,
        street1: address.street,
        street2: null,
        city: address.city,
        phone: address.telephone,
        isDefault: 1,
        alias: null,
        zipcode: address.postcode,
        country: address.country_id
      })
    })
  }

  return {
    id: magentoResponse.customer_id,
    gender: magentoResponse.gender ? magentoResponse.gender === '1' ? 'm' : 'f' : '',
    mail: magentoResponse.email,
    firstName: magentoResponse.firstname,
    lastName: magentoResponse.lastname,
    birthday: magentoResponse.dob ? moment(magentoResponse.dob, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD') : '',
    addresses: addresses
  }
}
