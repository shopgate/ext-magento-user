const UnauthorizedError = require('../models/Errors/UnauthorizedError')
const MagentoRequest = require('../lib/MagentoRequest')

/**
 * @typedef {Object} UpdatePasswordInput
 * @property {string} password - new password
 * @property {string} oldPassword - old password for verification
 * @property {string} token - current Bearer token
 * @property {string} userId - current customer ID
 */
/**
 * @param {StepContext} context
 * @param {UpdatePasswordInput} input
 */
module.exports = async (context, input) => {
  if (!context.meta.userId) {
    throw new UnauthorizedError()
  }

  const endpointUrl = `${context.config.magentoUrl}/customers/${input.userId}/password`
  const options = { password: input.password, oldPassword: input.oldPassword }
  const request = new MagentoRequest(context, input.token)

  return request.post(endpointUrl, options, 'Request to Magento: updatePassword')
}
