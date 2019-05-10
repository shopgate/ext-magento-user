const assert = require('assert')
const step = require('../../../token/getToken')

describe('getToken', () => {
  let request = null

  const context = {
    config: {
      credentials: {
        id: 'i1',
        secret: 's1'
      },
      magentoUrl: 'https://some.url'
    },
    storage: {
      device: {
        get: null,
        set: null,
        del: null
      }
    },
    log: {
      debug: (msg) => {},
      error: (msg) => {}
    },
    tracedRequest: () => {
      return request
    },
    meta: {}
  }

  beforeEach(() => {
    request = {
      post: () => {}
    }
    context.storage.device.get = () => {}
    context.storage.device.set = () => {}
    context.storage.device.del = () => {}
  })

  describe('guest token', () => {
    it('should get a token from storage', (done) => {
      context.storage.device.get = (key, cb) => {
        cb(null, {
          expires: (new Date()).getTime(),
          tokens: {
            accessToken: 'a1'
          }
        })
      }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.token, 'a1')
        done()
      })
    })

    it('should get a token from magento', (done) => {
      context.storage.device.get = (key, cb) => { cb(null, null) }

      const magentoResponse = {
        'expires_in': 3600,
        'access_token': 'a1'
      }

      request.post = (options, cb) => { cb(null, { statusCode: 200, body: magentoResponse }) }

      context.storage.device.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.token, 'a1')
        done()
      })
    })

    it('should return an error because getting token from storage fails', (done) => {
      context.storage.device.get = (key, cb) => { cb(new Error('error')) }
      step(context, null, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })

    it('should get a token from magento because the previous token is expired', (done) => {
      context.storage.device.get = (key, cb) => {
        cb(null, {
          expires: (new Date()).getTime() - 120 * 1000,
          tokens: {
            accessToken: 'a1'
          }
        })
      }

      const magentoResponse = {
        'expires_in': 3600,
        'access_token': 'a2'
      }

      request.post = (options, cb) => { cb(null, { statusCode: 200, body: magentoResponse }) }

      context.storage.device.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.token, 'a2')
        done()
      })
    })

    it('should return an error because getting token from magento fails', (done) => {
      context.storage.device.get = (key, cb) => { cb(null, null) }

      request.post = (options, cb) => { cb(null, { statusCode: 456, body: { foo: 'bar' } }) }

      step(context, null, (err) => {
        assert.strictEqual(err.constructor.name, 'MagentoEndpoint')
        assert.strictEqual(err.code, 'EINTERNAL')
        done()
      })
    })

    it('should return an error because setting token to storage fails', (done) => {
      context.storage.device.get = (key, cb) => {
        cb(null, {
          expires: (new Date()).getTime() - 120 * 1000,
          tokens: {
            accessToken: 'a1'
          }
        })
      }

      const magentoResponse = {
        'expires_in': 3600,
        'access_token': 'a2'
      }

      request.post = (options, cb) => { cb(null, { statusCode: 200, body: magentoResponse }) }

      context.storage.device.set = (key, value, cb) => { cb(new Error('error')) }

      step(context, null, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
  })

  describe('user token', () => {
    it('should get a token from storage', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => {
        cb(null, {
          expires: (new Date()).getTime(),
          tokens: {
            accessToken: 'a1'
          }
        })
      }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.token, 'a1')
        done()
      })
    })

    it('should get a token from magento via refresh token', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      const magentoResponse = {
        'expires_in': 3600,
        'access_token': 'a2',
        'refresh_token': 'r2'
      }

      request.post = (options, cb) => { cb(null, { statusCode: 200, body: magentoResponse }) }

      context.storage.device.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.strictEqual(result.token, 'a2')
        done()
      })
    })

    it('should return an error because the storage failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => { cb(new Error('error')) }

      step(context, null, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })

    it('should return an error because user is not logged in', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => { cb(null, null) }

      step(context, null, (err, result) => {
        assert.strictEqual(err, null)
        assert.strictEqual(result.token, null)
        done()
      })
    })

    it('should return an empty token because magento failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      context.storage.device.del = (key, cb) => {
        cb(null)
      }

      request.post = (options, cb) => { cb(null, { statusCode: 456, body: { foo: 'bar' } }) }

      step(context, null, (err, result) => {
        assert.strictEqual(result.token, null)
        assert.strictEqual(err, null)
        done()
      })
    })

    it('should return an error because set token failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.device.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      const magentoResponse = {
        'expires_in': 3600,
        'access_token': 'a2',
        'refresh_token': 'r2'
      }

      request.post = (options, cb) => { cb(null, { statusCode: 200, body: magentoResponse }) }

      context.storage.device.set = (key, value, cb) => { cb(new Error('error')) }

      step(context, null, (err) => {
        assert.strictEqual(err.message, 'error')
        done()
      })
    })
  })
})
