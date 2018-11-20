const ERROR_CODE = 'EUNKNOWN'

class Unknown extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'An internal error occurred.'
  }
}

module.exports = Unknown
