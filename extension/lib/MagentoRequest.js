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

    context.log.debug({request: util.inspect(options, true, null)}, 'Magento request')
    const startResponse = new Date()
    return await new Promise((resolve, reject) => {
      tracedRequest(
        options,
        (error, response) => {
          if (error) {
            this.log(context, startResponse, response.body, null)
            reject(new Error(error))
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            this.log(context, startResponse, response.body, response.statusCode)
            reject(new UnauthorizedError())
          } else if (response.statusCode === 404) {
            this.log(context, startResponse, response.body, response.statusCode)
            reject(new MagentoEndpointNotFoundError())
          } else if (response.statusCode === 405) {
            this.log(context, startResponse, response.body, response.statusCode)
            reject(new MagentoEndpointNotAllowedError())
          } else if (response.body.messages && response.body.messages.error) {
            this.log(context, startResponse, response.body, response.statusCode)
            reject(new MagentoEndpointError())
          } else { // This else is currently important, cause there is a bug within the tracedRequest which will crash the app otherwise
            this.log(context, startResponse, response.body, response.statusCode)
            resolve(response.body)
          }
        })
    })
  }

  static log (context, startResponse, message, statusCode) {
    context.log.debug({duration: new Date() - startResponse, statusCode, response: util.inspect(message, true, null)}, 'Magento response')
  }
}

module.exports = MagentoRequest
