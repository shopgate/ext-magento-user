const TokenHandler = require('../../helpers/tokenHandler')
const MagentoRequest = require('../../lib/MagentoRequest')
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

  let magentoTokenResponse = null
  const authUrl = context.config.magentoUrl + '/auth/token'
  const { parameters: { success, profile } } = input
  const request = context.tracedRequest('magento-user-extension:facebook-login', { log: true })

  if (!success) {
    throw new InvalidCredentialsError()
  }

  const th = new TokenHandler(context.config.credentials, authUrl, context.storage, context.log, request, !context.config.allowSelfSignedCertificate)

  try {
    magentoTokenResponse = await login(th, profile, input.strategy)
  } catch (e) {
    await register(await getAuthToken(th), profile)
    magentoTokenResponse = await login(th, profile, input.strategy)
  }

  await new Promise((resolve, reject) => {
    th.deleteGuestTokens((err) => {
      if (err) return reject(err)
      resolve()
    })
  })

  return { userId: profile.email, magentoTokenResponse }

  /**
   * @param {string} token
   * @param {Object} profile
   * @returns {Promise.<void>}
   */
  async function register (token, profile) {
    const user = {
      email: profile.email,
      firstname: profile.first_name,
      lastname: profile.last_name
    }

    const magentoRequest = new MagentoRequest(context, token)
    return magentoRequest.post(`${context.config.magentoUrl}/customers`, user)
  }

  /**
 * @param {TokenHandler} tokenHandler
 * @param {UserLoginInputParameters} userCredentials
 * @param {string} strategy
 */
  async function login (tokenHandler, userCredentials, strategy) {
    return new Promise((resolve, reject) => {
      tokenHandler.login(userCredentials, strategy, (err, magentoTokenResponse) => {
        if (err) {
          return reject(err)
        }
        resolve(magentoTokenResponse)
      })
    })
  }

  /**
 * @param {TokenHandler} tokenHandler
 * @returns {string} token
 */
  async function getAuthToken (tokenHandler) {
    return new Promise((resolve, reject) => {
      tokenHandler.getToken(false, (err, token) => {
        if (err) {
          return reject(err)
        }
        resolve(token)
      })
    })
  }
}
