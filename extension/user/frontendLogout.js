const Unauthorized = require('../models/Errors/Unauthorized')

module.exports = async () => {
  throw new Unauthorized()
}
