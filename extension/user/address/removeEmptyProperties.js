const _ = require('lodash')

module.exports = async function (context, input) {
  const magentoAddress = input.magentoAddress
  magentoAddress.street = _.compact(magentoAddress.street)

  if (magentoAddress.street.length === 0) {
    delete magentoAddress.street
  }

  return { magentoAddress: _.omitBy(magentoAddress, _.isNil) }
}
