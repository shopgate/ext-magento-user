const ERROR_CODE = 'EACCESS'

class Unauthorized extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'Permission denied.'
  }
}

module.exports = Unauthorized
