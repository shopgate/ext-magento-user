const MagentoEndpointNotFoundError = require('./../models/Errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/Errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/Errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const FieldValidationError = require('./../models/Errors/FieldValidationError')
const UnknownError = require('./../models/Errors/UnknownError')
const RequestLogger = require('../helpers/RequestLogger')
const _ = {
  trimEnd: require('lodash/trimEnd'),
  get: require('lodash/get')
}

/**
 * All needed methods to fire requests to magento
 */
class MagentoRequest {
  /**
   * @param {StepContext} context
   * @param {string} token
   */
  constructor (context, token) {
    this.requestLogger = new RequestLogger(context.log)
    this.request = context.tracedRequest('magento-user-extension:MagentoRequest').defaults({
      auth: {
        bearer: token
      },
      rejectUnauthorized: !context.config.allowSelfSignedCertificate,
      resolveWithFullResponse: true
    })
  }

  /**
   * Wrapper function to send POST requests to Magento
   *
   * @param {string} url
   * @param {Object} data
   * @param {string} message
   * @returns {Object}
   */
  async post (url, data, message = 'Request to Magento') {
    await this.send(url, message, 'POST', data)

    return { success: true }
  }

  /**
   * Wrapper function to send DELETE requests to Magento
   *
   * @param {string} url
   * @param {Object} data
   * @param {string} message
   * @returns {Object}
   */
  async delete (url, data, message = 'Request to Magento') {
    await this.send(url, message, 'DELETE', data)

    return { success: true }
  }

  /**
   * @param {string} url
   * @param {string} message
   * @param {string} method
   * @param {Object | boolean} data
   * @returns {Object}
   *
   * @throws FieldValidationError
   * @throws UnauthorizedError
   * @throws MagentoEndpointNotFoundError
   * @throws MagentoEndpointNotAllowedError
   * @throws MagentoEndpointError
   * @throws UnknownError
   */
  async send (url, message = 'Request to Magento', method = 'GET', data = true) {
    const options = {
      url: url,
      method: method,
      json: data
    }
    const timeStart = new Date()

    try {
      const response = await this.request(options)
      this.requestLogger.log(response, options, timeStart, message)
      return response.body
    } catch (error) {
      this.handleError(error, options, timeStart)
    }
  }

  /**
   * @param {Object} error
   * @param {Object} options
   * @param {Date} timeStart
   *
   * @throws FieldValidationError
   * @throws UnauthorizedError
   * @throws MagentoEndpointNotFoundError
   * @throws MagentoEndpointNotAllowedError
   * @throws MagentoEndpointError
   * @throws UnknownError
   */
  handleError (error, options, timeStart) {
    const statusCode = _.get(error, 'response.statusCode', 0)
    if (statusCode && statusCode >= 400) {
      switch (statusCode) {
        case 400:
          const validationError = new FieldValidationError()
          const validationErrors = _.get(error, 'error.messages.error', false)
          validationErrors && validationErrors.forEach(responseError => {
            const errors = responseError.messages && responseError.messages.map(item => _.trimEnd(item, '.')).join('. ') + '.'
            errors && validationError.addValidationMessage(responseError.path, errors)
          })
          this.requestLogger.log(error.response, options, timeStart, 'Request to Magento - FieldValidationError')
          throw validationError
        case 401:
        case 403:
          this.requestLogger.log(error.response, options, timeStart, 'Request to Magento - UnauthorizedError')
          throw new UnauthorizedError()
        case 404:
          this.requestLogger.log(error.response, options, timeStart, 'Request to Magento - MagentoEndpointNotFoundError')
          throw new MagentoEndpointNotFoundError()
        case 405:
          this.requestLogger.log(error.response, options, timeStart, 'Request to Magento - MagentoEndpointNotAllowedError')
          throw new MagentoEndpointNotAllowedError()
        default:
          this.requestLogger.log(error.response || {}, options, timeStart, 'Request to Magento - MagentoEndpointError')
          throw new MagentoEndpointError()
      }
    }
    this.requestLogger.log(error.response || {}, options, timeStart, `Request to Magento - ${error.message || 'Unknown Error'}`)
    throw new UnknownError()
  }
}

module.exports = MagentoRequest
