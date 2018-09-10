const ERROR_CODE = 'EVALIDATION'

/**
 * @class FieldValidationError
 */
class FieldValidationError extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'There was an error with the request'
    this.validationErrors = []
  }

  /**
   * @param {string} path - path of the error of the field, e.g. firstName
   * @param {string} message - error message that pertains to path
   * @param {string} [value] - passed down value if any
   */
  addValidationMessage (path, message, value) {
    path = this.translatePath(path)
    this.validationErrors.push({ path, message })
  }

  /**
   * Translates Magento error fields into pipeline fields
   *
   * @private
   * @returns {string}
   */
  translatePath (path) {
    const translations = {
      firstname: 'firstName',
      lastname: 'lastName',
      middlename: 'middleName',
      street: 'street1',
      region: 'province',
      postcode: 'zipCode',
      country_id: 'country'
    }
    return translations[path] || path
  }
}

module.exports = FieldValidationError
