const UtmParameters = require('../models/utmParameters/utmParameters')
const SgAppParameters = require('../models/sgAppParameters/sgAppParameters')

/**
 * @typedef {object} context.config
 * @property {string} registrationUrl
 * @property {object} utmParameters
 *
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  // Add additional query parameters for SG App call
  const WebCheckoutUrlSgAppParameters = new SgAppParameters()
  WebCheckoutUrlSgAppParameters.sgcloudInapp = 1

  const RegistrationUrlUtmParameters = new UtmParameters(context.config.utmParameters)
  cb(null, {url: context.config.registrationUrl + WebCheckoutUrlSgAppParameters.getQueryParameters() + RegistrationUrlUtmParameters.getQueryParameters()})
}
