const ERROR_CODE = 'EINTERNAL'

/**
 * For truly unknown Magento endpoint errors, e.g. code 500s.
 * Please consult the magento swagger definition for possible error
 * outputs and use this error as a fallback to all unknown cases.
 *
 * @param {string} message - error text message received from Magento
 */
class MagentoEndpoint extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'An internal error occurred.'
  }
}

module.exports = MagentoEndpoint
