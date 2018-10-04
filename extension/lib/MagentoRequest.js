const MagentoEndpointNotFoundError = require('./../models/Errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/Errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/Errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/Errors/UnauthorizedError')
const FieldValidationError = require('./../models/Errors/FieldValidationError')
const util = require('util')
const _ = {
  trimEnd: require('lodash/trimEnd')
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
   * @throws Error
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
      if (error.response.statusCode === 400) {
        const validationError = new FieldValidationError()
        error.error.messages.error.forEach(responseError => {
          const errors = responseError.messages && responseError.messages.map(item => _.trimEnd(item, '.')).join('. ') + '.'
          errors && validationError.addValidationMessage(responseError.path, errors)
        })
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'FieldValidationError')
        throw validationError
      } else if (error.response.statusCode === 401 || error.response.statusCode === 403) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'UnauthorizedError')
        throw new UnauthorizedError()
      } else if (error.response.statusCode === 404) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointNotFoundError')
        throw new MagentoEndpointNotFoundError()
      } else if (error.response.statusCode === 405) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointNotAllowedError')
        throw new MagentoEndpointNotAllowedError()
      } else if (error.error) {
        this.log(error.response, util.inspect(options, true, 5), timeStart, 'MagentoEndpointError')
        throw new MagentoEndpointError()
      } else {
        this.log(error.response, util.inspect(options, true, 5), timeStart, message)
        throw new Error(error)
      }
    }
  }

  log (response, request, timerStart, message) {
    this.logger.debug(
      {
        duration: new Date() - timerStart,
        statusCode: response.statusCode,
        request,
        response:
          {
            headers: response.headers,
            body: response.body
          }
      },
      message
    )
  }
}

module.exports = MagentoRequest
