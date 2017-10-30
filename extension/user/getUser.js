/**
 * @param {object} context
 * @param {object} input
 * @param {function} cb
 */
module.exports = function (context, input, cb) {
  if (context.meta.userId) {
    return cb(null, {
      id: '87ddbbdb-5b09-4dc4-b1b0-214f4b0fdaa1',
      mail: '',
      firstName: '',
      lastName: ''
    })
  }

  const mockedError = {code: 'EACCESS', message: 'user is not logged in (getUser)'}
  cb(mockedError)
}
