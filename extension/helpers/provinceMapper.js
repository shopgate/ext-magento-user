const provinceCodeMappingByCountry = require('./provinceMap')

module.exports = {
  /**
   * @param {string} country_id
   * @param {string} province
   * @return {string}
   */
  getMagentoRegion : (country_id , province) => {
    const mapping = provinceCodeMappingByCountry[country_id] || []
    const result = mapping.find((item) => item.provinceISO === province) || { magentoCode : province }

    return result.magentoCode
  },

  /**
   * @param {string} country_id
   * @param {string} region_code
   * @return {string}
   */
  getProvince : (country_id , region_code) => {
    const mapping = provinceCodeMappingByCountry[country_id] || []
    const result = mapping.find((item) => item.magentoCode === region_code) || { provinceISO : region_code }

    return result.provinceISO
  }
}
