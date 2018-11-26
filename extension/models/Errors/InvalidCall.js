const ERROR_CODE = 'EINVALIDCALL'

/**
 * Use this class for errors that happen in the pipeline
 * or passing information around the extension and between steps
 *
 * @param {string} [message=An extension error occurred.]
 * @default An extension error occurred.
 */
class InvalidCall extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'An extension error occurred.'
  }
}

module.exports = InvalidCall
