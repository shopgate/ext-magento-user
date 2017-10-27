/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  if (context.meta.userId) {
    return cb(null, {
      id: '87ddbbdb-5b09-4dc4-b1b0-214f4b0fdaa1',
      mail: 'steffen.zull@shopgate.com',
      firstName: 'Steffen',
      lastName: 'Zull'
    })
  }
  cb(new Error('user is not logged in (getUser)'))
}
