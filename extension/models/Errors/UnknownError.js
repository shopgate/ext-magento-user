const ERROR_CODE = 'EUNKNOWN'

class UnknownError extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'An internal error occurred.'
  }
}

module.exports = UnknownError
