const isString = require('lodash/isString')
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
        super(message !== '' && isString(message)
            ? message
            : 'Requested endpoint url was now allowed to be called.')
        this.code = ERROR_CODE
    }
}

module.exports = MagentoEndpointNotFound
