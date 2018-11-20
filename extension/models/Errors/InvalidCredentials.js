const ERROR_CODE = 'EINVALIDCREDENTIALS'

class InvalidCredentials extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'The given credentials are wrong or do not exist.'
  }
}

module.exports = InvalidCredentials
