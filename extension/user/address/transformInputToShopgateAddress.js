module.exports = async (context, input) => {
  /** @var {ShopgateAddress} shopgateAddress */
  const shopgateAddress = {
    firstName: input.firstName,
    lastName: input.lastName,
    street1: input.street1,
    street2: input.street2,
    zipCode: input.zipCode,
    city: input.city,
    province: input.province,
    country: input.country,
    tags: input.tags,
    customAttributes: input.customAttributes
  }

  return { shopgateAddress }
}
