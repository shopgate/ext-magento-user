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
    ...address.customAttributes
  }

  return { magentoAddress }
}
