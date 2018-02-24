const EACCESS = 'EACCESS'

class UnauthorizedError extends Error {
  constructor () {
    super('Permission denied.')
    this.code = EACCESS
  }
}

module.exports = UnauthorizedError
