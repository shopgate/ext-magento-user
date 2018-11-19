const provinceCodeMappingByCountry = require('./provinceMap')

module.exports = {
  /**
   * @param {string} countryId
   * @param {string} province
   * @return {string}
   */
  getMagentoRegion: (countryId, province) => {
    const mapping = provinceCodeMappingByCountry[countryId] || []
    const result = mapping.find((item) => item.shopgateCode === province) || {}

    return result.magentoCode || province
  },

  /**
   * @param {string} countryId
   * @param {string} regionCode
   * @return {string}
   */
  getProvince: (countryId, regionCode) => {
    const mapping = provinceCodeMappingByCountry[countryId] || []
    const result = mapping.find((item) => item.magentoCode === regionCode) || {}

    return result.shopgateCode || regionCode
  }
}
