const isString = require('lodash/isString')
const ERROR_CODE = 'EMAGENTOENDPOINTNOTFOUND'

/**
 * In case a requested magento endpoint could not be found (Http status code 404)
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
            : 'Requested endpoint url could not be found or is not implemented.')
        this.code = ERROR_CODE
    }
}

module.exports = MagentoEndpointNotFound
