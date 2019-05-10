const util = require('util')

module.exports = class {
  /**
   * @param {StepContextLogger} logger
   */
  constructor (logger) {
    this.logger = logger
    this.obfuscationProperties = ['json', 'headers', 'auth', 'body']
  }

  /**
   * @param {Object} response
   * @param {Object} request
   * @param {Date} timerStart
   * @param {string} message
   */
  log (response, request, timerStart, message) {
    const loggableRequest = this.obfuscate(request)
    const loggableResponse = this.obfuscate(response)

    this.logger.debug(
      {
        duration: new Date() - timerStart,
        statusCode: response.statusCode || 0,
        request: util.inspect(loggableRequest, { depth: 5 }),
        response: util.inspect({
          headers: loggableResponse.headers || {},
          body: loggableResponse.body || {}
        }, { depth: 5 })
      },
      message
    )
  }

  obfuscate (obj) {
    const loggableObject = Object.assign({}, obj)
    this.obfuscationProperties.forEach(propertyName => {
      if (!obj[propertyName] || !(typeof obj[propertyName] === 'object')) {
        return
      }

      Object.keys(obj[propertyName]).forEach(subPropertyName => {
        switch (subPropertyName) {
          case 'password': case 'code': case 'refresh_token': case 'access_token': case 'authorization': case 'bearer':
            loggableObject[propertyName][subPropertyName] = 'xxxxxx'
        }
      })
    })

    return loggableObject
  }
}
