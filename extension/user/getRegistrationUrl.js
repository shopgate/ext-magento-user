const UtmParameters = require ('../models/utmParameters/utmParameters')

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

  const RegistrationUrlUtmParameters = new UtmParameters(context.config.utmParameters)
  cb(null, {url: context.config.registrationUrl + RegistrationUrlUtmParameters.getQueryParameters()})
}
