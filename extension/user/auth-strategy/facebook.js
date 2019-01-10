const TokenHandler = require('../../helpers/tokenHandler')
const InvalidCredentialsError = require('../../models/Errors/InvalidCredentials')

/**
 * Not implemented yet
 * @param {StepContext} context The connect context.
 * @param {Object} input The step input.
 * @throws {InvalidCredentialsError}
 * @returns {Object}
 */
module.exports = async (context, input) => {
  if (input.strategy !== 'facebook') {
    return {}
  }

  const authUrl = context.config.magentoUrl + '/auth/token'
  const { parameters: { success, profile } } = input
  const request = context.tracedRequest('magento-user-extension:facebook-login', { log: true })

  if (!success) {
    throw new InvalidCredentialsError()
  }

  const th = new TokenHandler(context.config.credentials, authUrl, context.storage, context.log, request, !context.config.allowSelfSignedCertificate)

  const magentoTokenResponse = await login(th, profile, input.strategy)
  await new Promise((resolve, reject) => {
    th.deleteGuestTokens((err) => {
      if (err) return reject(err)
      resolve()
    })
  })

  return { userId: profile.email, magentoTokenResponse }

  /**
   * @param {TokenHandler} tokenHandler
   * @param {UserLoginInputParameters} userCredentials
   * @param {string} strategy
   */
  async function login (tokenHandler, userCredentials, strategy) {
    return new Promise((resolve, reject) => {
      tokenHandler.login(userCredentials, strategy, (err, magentoTokenResponse) => {
        if (err) return reject(err)
        resolve(magentoTokenResponse)
      })
    })
  }
}
