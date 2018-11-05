const MagentoEndpointNotFoundError = require('../models/Errors/MagentoEndpointNotFound')
const MagentoEndpointNotAllowedError = require('../models/Errors/MagentoEndpointNotAllowed')
const MagentoEndpointError = require('../models/Errors/MagentoEndpoint')
const UnauthorizedError = require('../models/Errors/Unauthorized')
const FieldValidationError = require('../models/Errors/FieldValidation')
const UnknownError = require('../models/Errors/Unknown')
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

    let response
    try {
      response = await this.request(options)
    } catch (error) {
      return this.handleError(error, options, timeStart)
    }

    if (response.body && typeof response.body !== 'object') {
      this.requestLogger.log({}, options, timeStart, 'Request to Magento - MagentoEndpointError - Response not JSON')
      throw new MagentoEndpointError('Response not JSON.')
    }

    this.requestLogger.log(response, options, timeStart, message)
    return response.body
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
    throw new UnknownError(error.message)
  }
}

module.exports = MagentoRequest
