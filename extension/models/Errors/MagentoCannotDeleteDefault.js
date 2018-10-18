const ERROR_CODE = 'ENOREMOVEDEFAULT'

/**
 * In case the customer tries to delete a default billing or shipping address
 *
 * @extends Error
 * @param {string} [message=Cannot delete the default address]
 * @default Cannot delete the default address
 */
class MagentoCannotDeleteDefault extends Error {
  constructor (message) {
    super()
    this.code = ERROR_CODE
    this.message = message || 'Cannot delete the default address'
  }
}

module.exports = MagentoCannotDeleteDefault
