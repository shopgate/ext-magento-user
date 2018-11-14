const provinceCodeMappingByCountry = require('./provinceCodeMappingByCountry')
/**
 * @class
 * @classdesc Handles the mapping of ISO province/state codes and magento region
 */
module.exports = class {
  /**
   * @param {string} country_id
   * @param {string} province
   * @return {string}
   */
  getMagentoRegion (country_id, province) {
    const mapping = provinceCodeMappingByCountry[country_id] || []
    return (mapping.find(function (element) {
      return element.provinceISO === province
    }) || { magentoCode: province }).magentoCode
  }

  /**
   * @param {string} country_id
   * @param {string} region_code
   * @return {string}
   */
  getProvince (country_id, region_code) {
    const mapping = provinceCodeMappingByCountry[country_id] || []
    return (mapping.find(function (element) {
      return element.magentoCode === region_code
    }) || { provinceISO: region_code }).provinceISO
  }
}
