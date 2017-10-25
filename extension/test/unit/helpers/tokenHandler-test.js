const assert = require('assert')
const TokenHandler = require('../../../helpers/tokenHandler')

// NOTE: All the other tests are implicitly done in getToken-test.js and setToken-test.js

describe('Tokenhandler', () => {
  const storages = {
    user: {
      del: null
    }
  }

  const log = {
    debug: () => {}
  }

  const request = {
    post: null
  }

  const tracedRequest = () => {
    return request
  }

  beforeEach(() => {
    request.post = () => {}
    storages.user.del = (key, cb) => { cb(null) }
  })

  const th = new TokenHandler(null, 'http://some.url', storages, log, tracedRequest)

  describe('logout', () => {
    it('should logout the user by deleting the tokens', (done) => {
      th.logout((err) => {
        assert.ifError(err)
        done()
      })
    })

    it('should return an error because deleting the tokens failed', (done) => {
      storages.user.del = (key, cb) => { cb(new Error('error')) }

      th.logout((err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })

  describe('_getTokensFromMagento', () => {
    it('should return an error because deleting the tokens failed', (done) => {
      request.post = (options, cb) => { cb(new Error('error')) }

      th._getTokensFromMagento(null, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })
})
