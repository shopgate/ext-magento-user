const ERROR_CODE = 'EMAGENTOENDPOINTNOTALLOWED'

/**
 * In case a requested magento endpoint method is not allowed to be used (Http status code 405)
 * Please consult the magento swagger definition for possible error outputs.
 *
 * @extends Error
 * @param {string} [message=Requested endpoint url could not be found or is not implemented.]
 * @default Requested endpoint url could not be found or is not implemented.
 */
class MagentoEndpointNotFound extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'Requested endpoint url was not allowed to be called.'
  }
}

module.exports = MagentoEndpointNotFound
