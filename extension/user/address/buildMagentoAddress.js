module.exports = async (context, input) => {
  /** @var {MagentoAddress} magentoAddress */
  const magentoAddress = {
    firstname: input.firstName,
    lastname: input.lastName,
    postcode: input.zipCode,
    city: input.city,
    region: input.province,
    country_id: input.country,
    street: [
      input.street1,
      input.street2
    ],
    ...input.customAttributes
  }

  return { magentoAddress }
}
