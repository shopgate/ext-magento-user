const MagentoEndpointNotFoundError = require('./../models/Errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/Errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/Errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const FieldValidationError = require('./../models/Errors/FieldValidationError')
const UnknownError = require('./../models/Errors/UnknownError')
const util = require('util')
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
    this.logger = context.log
    this.request = context.tracedRequest('magento-user-extension:MagentoRequest', { log: true }).defaults({
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
      this.log(response, util.inspect(options, true, 5), timeStart, message)
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
    const parsedOptions = util.inspect(options, true, 5)
    if (statusCode && statusCode >= 400) {
      switch (statusCode) {
        case 400:
          const validationError = new FieldValidationError()
          const validationErrors = _.get(error, 'error.messages.error', false)
          validationErrors && validationErrors.forEach(responseError => {
            const errors = responseError.messages && responseError.messages.map(item => _.trimEnd(item, '.')).join('. ') + '.'
            errors && validationError.addValidationMessage(responseError.path, errors)
          })
          this.log(error.response, parsedOptions, timeStart, 'FieldValidationError')
          throw validationError
        case 401:
        case 403:
          this.log(error.response, parsedOptions, timeStart, 'UnauthorizedError')
          throw new UnauthorizedError()
        case 404:
          this.log(error.response, parsedOptions, timeStart, 'MagentoEndpointNotFoundError')
          throw new MagentoEndpointNotFoundError()
        case 405:
          this.log(error.response, parsedOptions, timeStart, 'MagentoEndpointNotAllowedError')
          throw new MagentoEndpointNotAllowedError()
        default:
          this.log(error.response || {}, parsedOptions, timeStart, 'MagentoEndpointError')
          throw new MagentoEndpointError()
      }
    }
    this.log(error.response || {}, parsedOptions, timeStart, error.message || '')
    throw new UnknownError()
  }

  /**
   * @param {Object} response
   * @param {Object} request
   * @param {Date} timerStart
   * @param {string} message
   */
  log (response, request, timerStart, message) {
    this.logger.debug(
      {
        duration: new Date() - timerStart,
        statusCode: response.statusCode || 0,
        request,
        response:
          {
            headers: response.headers || {},
            body: response.body || {}
          }
      },
      message
    )
  }
}

module.exports = MagentoRequest
