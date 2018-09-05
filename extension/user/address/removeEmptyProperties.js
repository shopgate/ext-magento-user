const _ = require('lodash')

module.exports = async function (context, input) {
  input.magentoAddress.street = _.compact(input.magentoAddress.street)

  if (input.magentoAddress.street.length === 0) {
    delete input.magentoAddress.street
  }
  return { magentoAddress: _.omitBy(input.magentoAddress, _.isNil) }
}
