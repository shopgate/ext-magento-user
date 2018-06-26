const MagentoEndpointNotFoundError = require('./../models/Errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/Errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/Errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const util = require('util')

/**
 * All needed methods to fire requests to magento
 */
class MagentoRequest {
  /**
   * @param {string} url
   * @param {Object} context
   * @param {string} token
   * @returns {Object}
   */
  static async send (url, context, token) {

    const options = {
      url: url,
      json: true,
      rejectUnauthorized: !context.config.allowSelfSignedCertificate,
      auth: {
        bearer: token
      }
    }

    const tracedRequest = context.tracedRequest('magento-user-extension:MagentoRequest', {log: true})

    context.log.debug(`Made a magento request ${util.inspect(options)}`)
    return await new Promise((resolve, reject) => {
      tracedRequest(
        options,
        (error, response, body) => {
          if (error) {
            reject(new Error(error))
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            reject(new UnauthorizedError())
          } else if (response.statusCode === 404) {
            reject(new MagentoEndpointNotFoundError())
          } else if (response.statusCode === 405) {
            reject(new MagentoEndpointNotAllowedError())
          } else if (body.messages && body.messages.error) {
            reject(new MagentoEndpointError())
          } else { // This else is currently important, cause there is a bug within the tracedRequest which will crash the app otherwise
            context.log.debug(`Magento response ${util.inspect(body)}`)
            resolve(body)
          }
        })
    })
  }
}

module.exports = MagentoRequest
