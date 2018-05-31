const MagentoEndpointNotFoundError = require('./../models/errors/MagentoEndpointNotFoundError')
const MagentoEndpointNotAllowedError = require('./../models/errors/MagentoEndpointNotAllowedError')
const MagentoEndpointError = require('./../models/errors/MagentoEndpointError')
const UnauthorizedError = require('./../models/errors/UnauthorizedError')
const request = require('request')

/**
 * All needed methods to fire requests to magento
 */
class MagentoRequest {
    /**
     * @param {string} url
     * @param {Object} context
     * @param {string} token
     * @returns {Object}
     */
    static async send (url, context, token) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                json: true,
                auth: {
                    bearer: token
                }
            }, (error, response, body) => {
                if (error) {
                    context.log.error(error, url)
                    reject(new Error(error))
                } else if (response.statusCode === 401 || response.statusCode === 403) {
                    reject(new UnauthorizedError())
                } else if (response.statusCode === 404) {
                    reject(new MagentoEndpointNotFoundError())
                } else if (response.statusCode === 405) {
                    reject(new MagentoEndpointNotAllowedError())
                } else if (body.messages && body.messages.error) {
                    context.log.error(body.messages.error, url)
                    reject(new MagentoEndpointError())
                }
                resolve(body)
            })
        })
    }
}

module.exports = MagentoRequest
