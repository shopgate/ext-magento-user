const provinceCodeMapping = require('../../helpers/provinceCodeMapping')

module.exports = async (context, input) => {

  /** @var {MagentoAddress} magentoAddress */
  const magentoAddress = {
    firstname: input.firstName,
    lastname: input.lastName,
    postcode: input.zipCode,
    city: input.city,
    region: getMagentoRegion(input.country, input.province),
    country_id: input.country,
    street: [
      input.street1,
      input.street2
    ],
    ...input.customAttributes
  }

  return { magentoAddress }

  /**
   * @param {string} country_id
   * @param {string} province
   * @return {string}
   * @private
   */
  function getMagentoRegion(country_id, province) {
    return (provinceCodeMapping().find(function (element) {
      return element.provinceISO === province && element.countryISO === country_id
    }) || { magentoCode: province }).magentoCode
  }
}
