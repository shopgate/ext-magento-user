const MagentoEndpointNotFoundError = require('./../models/Errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/Errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/Errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const FieldValidationError = require('./../models/Errors/FieldValidationError')
const util = require('util')

/**
 * All needed methods to fire requests to magento
 */
class MagentoRequest {

  /**
   * Wrapper function to send POST requests to Magento
   *
   * @param {string} url
   * @param {Object} context
   * @param {string} token
   * @param {Object} data
   * @param {string} message
   * @returns {string}
   */
  static async post (url, context, token, data, message = 'Request to Magento') {
    const response = this.send(url, context, token, message, 'POST', data)

    return response.then(function () {
      return {success: true}
    }).catch(function (e) {
      console.log(JSON.stringify(e))
      return response
    })
  }

  /**
   * @param {string} url
   * @param {Object} context
   * @param {string} token
   * @param {string} message
   * @param {string} method
   * @param {Object | boolean} data
   * @returns {Object}
   */
  static async send (url, context, token, message = 'Request to Magento', method = 'GET', data = true) {
    const options = {
      url: url,
      method: method,
      json: data,
      rejectUnauthorized: !context.config.allowSelfSignedCertificate,
      auth: {
        bearer: token
      }
    }

    const tracedRequest = context.tracedRequest('magento-user-extension:MagentoRequest', {log: true})
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
            this.log(null, util.inspect(options, true, 5), new Date(), message)
            reject(new Error(error))
          } else if (response.statusCode === 400) {
            const validationError = new FieldValidationError()
            const magentoError = response.body.messages.error.pop()
            validationError.addValidationMessage(magentoError.path, magentoError.messages.join())
            reject(validationError)
          } else if (response.statusCode === 401 || response.statusCode === 403) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'UnauthorizedError')
            reject(new UnauthorizedError())
          } else if (response.statusCode === 404) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointNotFoundError')
            reject(new MagentoEndpointNotFoundError())
          } else if (response.statusCode === 405) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointNotAllowedError')
            reject(new MagentoEndpointNotAllowedError())
          } else if (response.body.messages && response.body.messages.error) {
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), 'MagentoEndpointError')
            reject(new MagentoEndpointError())
          } else { // This else is currently important, cause there is a bug within the tracedRequest which will crash the app otherwise
            this.log(response.statusCode, util.inspect(options, true, 5), new Date(), message)
            resolve(response.body)
          }
        })
    })
  }

  static log (statusCode, request, timerStart, message) {
    this.context.log.debug(
      {
        duration: new Date() - timerStart,
        statusCode,
        request,
        response:
          {
            headers: this.response.headers,
            body: this.response.body
          }
      },
      message
    )
  }
}

module.exports = MagentoRequest
