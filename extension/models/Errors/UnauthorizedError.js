const ERROR_CODE = 'EACCESS'

class UnauthorizedError extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'Permission denied.'
  }
}

module.exports = UnauthorizedError
