const util = require('util')

module.exports = class {
  /**
   * @param {StepContextLogger} logger
   */
  constructor (logger) {
    this.logger = logger
  }

  /**
   * @param {Object} response
   * @param {Object} request
   * @param {Date} timerStart
   * @param {string} message
   */
  log (response, request, timerStart, message) {
    // obfuscate known auth secrets from request
    const loggableRequest = Object.assign({}, request)
    if (loggableRequest.json && typeof loggableRequest.json === 'object') {
      loggableRequest.json.password = request.json.password ? 'xxxxxx' : undefined
      loggableRequest.json.code = request.json.code ? 'xxxxxx' : undefined
      loggableRequest.json.refresh_token = request.json.refresh_token ? 'xxxxxx' : undefined
    }

    if (loggableRequest.headers) {
      loggableRequest.headers.authorization = request.headers.authorization ? 'xxxxxx' : undefined
    }

    if (loggableRequest.auth) {
      loggableRequest.auth.password = request.auth.password ? 'xxxxxx' : undefined
      loggableRequest.auth.bearer = request.auth.bearer ? 'xxxxxx' : undefined
    }

    // obfuscate known auth secrets from response
    const loggableResponse = Object.assign({}, response)

    if (loggableResponse.body) {
      loggableResponse.body.access_token = response.body.access_token ? 'xxxxxx' : undefined
      loggableResponse.body.refresh_token = response.body.refresh_token ? 'xxxxxx' : undefined
    }

    this.logger.debug(
      {
        duration: new Date() - timerStart,
        statusCode: response.statusCode || 0,
        request: util.inspect(loggableRequest, {depth: 5}),
        response: util.inspect({
          headers: loggableResponse.headers || {},
          body: loggableResponse.body || {}
        }, {depth: 5})
      },
      message
    )
  }
}
