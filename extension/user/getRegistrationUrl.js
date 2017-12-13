const UtmParameters = require ('../models/utmParameters/utmParameters')

/**
 * @typedef {object} context.config
 * @property {string} registrationUrl
 *
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {

  const RegistrationUrlUtmParameters = new UtmParameters()
  RegistrationUrlUtmParameters.source = 'shopgate'
  RegistrationUrlUtmParameters.medium = 'app'
  RegistrationUrlUtmParameters.campaign = 'web-register'

  cb(null, {url: context.config.registrationUrl + RegistrationUrlUtmParameters.getQueryParameters()})
}
