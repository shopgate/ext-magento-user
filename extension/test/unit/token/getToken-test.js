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
        set: null
      },
      user: {
        get: null,
        set: null
      }
    },
    log: {
      debug: (msg) => {}
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
    context.storage.user.get = () => {}
    context.storage.user.set = () => {}
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
        assert.equal(result.token, 'a1')
        done()
      })
    })

    it('should get a token from magento', (done) => {
      context.storage.device.get = (key, cb) => { cb(null, null) }

      const magentoResponse = {
        success: [
          {
            'expires_in': 3600,
            'access_token': 'a1'
          }
        ]
      }

      request.post = (options, cb) => { cb(null, {statusCode: 200}, magentoResponse) }

      context.storage.device.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.equal(result.token, 'a1')
        done()
      })
    })

    it('should return an error because getting token from storage fails', (done) => {
      context.storage.device.get = (key, cb) => { cb(new Error('error')) }
      step(context, null, (err) => {
        assert.equal(err.message, 'error')
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
        success: [
          {
            'expires_in': 3600,
            'access_token': 'a2'
          }
        ]
      }

      request.post = (options, cb) => { cb(null, {statusCode: 200}, magentoResponse) }

      context.storage.device.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.equal(result.token, 'a2')
        done()
      })
    })

    it('should return an error because getting token from magento fails', (done) => {
      context.storage.device.get = (key, cb) => { cb(null, null) }

      request.post = (options, cb) => { cb(null, {statusCode: 456}, {foo: 'bar'}) }

      step(context, null, (err, result) => {
        assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
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
        success: [
          {
            'expires_in': 3600,
            'access_token': 'a2'
          }
        ]
      }

      request.post = (options, cb) => { cb(null, {statusCode: 200}, magentoResponse) }

      context.storage.device.set = (key, value, cb) => { cb(new Error('error')) }

      step(context, null, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })

  describe('user token', () => {
    it('should get a token from storage', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => {
        cb(null, {
          expires: (new Date()).getTime(),
          tokens: {
            accessToken: 'a1'
          }
        })
      }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.equal(result.token, 'a1')
        done()
      })
    })

    it('should get a token from magento via refresh token', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      const magentoResponse = {
        success: [
          {
            'expires_in': 3600,
            'access_token': 'a2',
            'refresh_token': 'r2'
          }
        ]
      }

      request.post = (options, cb) => { cb(null, {statusCode: 200}, magentoResponse) }

      context.storage.user.set = (key, value, cb) => { cb(null) }

      step(context, null, (err, result) => {
        assert.ifError(err)
        assert.equal(result.token, 'a2')
        done()
      })
    })

    it('should return an error because the storage failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => { cb(new Error('error')) }

      step(context, null, (err) => {
        assert.equal(err.message, 'error')
        done()
      })
    })

    it('should return an error because user is not logged in', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => { cb(null, null) }

      step(context, null, (err, result) => {
        assert.equal(err.message, 'user is not logged in')
        done()
      })
    })

    it('should return an error because magento failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      request.post = (options, cb) => { cb(null, {statusCode: 456}, {foo: 'bar'}) }

      step(context, null, (err, result) => {
        assert.equal(err.message, 'Got 456 from magento: {"foo":"bar"}')
        done()
      })
    })
    it('should return an error because set token failed', (done) => {
      context.meta.userId = 'u1'

      context.storage.user.get = (key, cb) => {
        cb(null, {
          tokens: {
            refreshToken: 'r2'
          },
          expires: (new Date()).getTime()
        })
      }

      const magentoResponse = {
        success: [
          {
            'expires_in': 3600,
            'access_token': 'a2',
            'refresh_token': 'r2'
          }
        ]
      }

      request.post = (options, cb) => { cb(null, {statusCode: 200}, magentoResponse) }

      context.storage.user.set = (key, value, cb) => { cb(new Error('error')) }

      step(context, null, (err, result) => {
        assert.equal(err.message, 'error')
        done()
      })
    })
  })
})
