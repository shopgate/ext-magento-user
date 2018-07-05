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

    this.request = util.inspect(options, true, null)
    this.startResponse = new Date()
    this.context = context

    return await new Promise((resolve, reject) => {
      tracedRequest(
        options,
        (error, response) => {
          this.response = null
          if (response) {
            this.response = response
          }

          if (error) {
            this.log(null)
            reject(new Error(error))
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            this.log(response.statusCode, 'UnauthorizedError')
            reject(new UnauthorizedError())
          } else if (response.statusCode === 404) {
            this.log(response.statusCode, 'MagentoEndpointNotFoundError')
            reject(new MagentoEndpointNotFoundError())
          } else if (response.statusCode === 405) {
            this.log(response.statusCode, 'MagentoEndpointNotAllowedError')
            reject(new MagentoEndpointNotAllowedError())
          } else if (response.body.messages && response.body.messages.error) {
            this.log(response.statusCode, 'MagentoEndpointError')
            reject(new MagentoEndpointError())
          } else { // This else is currently important, cause there is a bug within the tracedRequest which will crash the app otherwise
            this.log(response.statusCode)
            resolve(response.body)
          }
        })
    })
  }

  static log (statusCode, message = 'Magento response') {
    this.context.log.debug({duration: new Date() - this.startResponse, statusCode, request: this.request, response: util.inspect(this.response, true, null)}, message)
  }
}

module.exports = MagentoRequest
