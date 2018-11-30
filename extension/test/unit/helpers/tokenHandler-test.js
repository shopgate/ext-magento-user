const assert = require('assert')
const rewire = require('rewire')
const TokenHandler = rewire('../../../helpers/tokenHandler')

// NOTE: All the other tests are implicitly done in getToken-test.js and setToken-test.js

describe('Tokenhandler', () => {
  const credentials = {
    id: null,
    secret: null
  }
  const storages = {
    device: {
      del: null
    }
  }

  const log = {
    debug: () => {
    },
    error: () => {
    }
  }

  beforeEach(() => {
    storages.device.del = (key, cb) => {
      cb(null)
    }
  })

  const tracedRequest = {
    defaults: () => {
      return {
        post: () => {
        }
      }
    }
  }

  const th = new TokenHandler(credentials, 'http://some.url', storages, log, tracedRequest)
  describe('logout', () => {
    it('should logout the user by deleting the tokens', (done) => {
      TokenHandler.logout(storages, (err) => {
        assert.ifError(err)
        done()
      })
    })

    it('should return an error because deleting the tokens failed', (done) => {
      storages.device.del = (key, cb) => {
        cb(new Error('error'))
      }

      TokenHandler.logout(storages, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
  })

  describe('_getTokensFromMagento', () => {
    it('should return an error because deleting the tokens failed', (done) => {
      th.request.post = (options, cb) => {
        cb(new Error('error'))
      }

      const options = {
        json: {

        }
      }

      // noinspection JSAccessibilityCheck
      th._getTokensFromMagento(options, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
    it('should return a magento endpoint error because the endpoint returned a bad result', (done) => {
      th.request.post = (options, cb) => {
        cb(null, { statusCode: 500, body: { error: 'error' } })
      }

      const options = {
        json: {

        }
      }

      // noinspection JSAccessibilityCheck
      th._getTokensFromMagento(options, (err) => {
        assert.strictEqual(err.constructor.name, 'MagentoEndpointError')
        assert.strictEqual(err.code, 'EINTERNAL')
        done()
      })
    })
  })
})
