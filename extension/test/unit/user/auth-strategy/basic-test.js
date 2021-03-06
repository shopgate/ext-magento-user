const assert = require('assert')
const step = require('../../../../user/auth-strategy/basic')
const expect = require('chai').expect

describe('basic login', () => {
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
        set: null,
        get: null,
        del: null
      },
      user: {
        set: null,
        get: null,
        del: null
      }
    },
    log: {
      debug: () => {
      },
      error: () => {
      }
    },
    tracedRequest: () => {
      return request
    }
  }

  const input = {
    strategy: null,
    parameters: {
      login: 'u1',
      password: 'p1'
    }
  }

  beforeEach(() => {
    input.strategy = 'basic'
    request = {
      post: () => {}
    }
  })

  it('should login to magento', (done) => {
    const magentoResponse = {
      'expires_in': 3600,
      'access_token': 'a1',
      'refresh_token': 'r1'
    }

    const magentoTokenResponse = {
      lifeSpan: magentoResponse.expires_in,
      tokens: {
        accessToken: magentoResponse['access_token'],
        refreshToken: magentoResponse['refresh_token']
      }
    }

    request.post = (options, cb) => {
      cb(null, { statusCode: 200, body: magentoResponse })
    }

    context.storage.device.del = (key, cb) => {
      cb(null)
    }

    step(context, input, (err, result) => {
      assert.ifError(err)
      assert.strictEqual(result.userId, input.parameters.login)
      expect(magentoTokenResponse).to.eql(result.magentoTokenResponse)
      done()
    })
  })

  it('should return an empty object if the input strategy "basic" does not match', (done) => {
    input.strategy = 'sthWeird'

    step(context, input, (err, data) => {
      assert.deepStrictEqual(err, null)
      assert.deepStrictEqual(data, {})
      done()
    })
  })

  it('should return an error because login to magento failed', (done) => {
    request.post = (options, cb) => {
      cb(null, { statusCode: 456, body: { foo: 'bar' } })
    }

    step(context, input, (err) => {
      assert.strictEqual(err.constructor.name, 'InvalidCredentials')
      assert.strictEqual(err.code, 'EINVALIDCREDENTIALS')
      done()
    })
  })

  it('should return an error because deleting guest tokens failed', (done) => {
    const magentoResponse = {
      'expires_in': 3600,
      'access_token': 'a1',
      'refresh_token': 'r1'
    }

    request.post = (options, cb) => {
      cb(null, { statusCode: 200, body: magentoResponse })
    }

    context.storage.device.del = (key, cb) => {
      cb(new Error('error'))
    }

    step(context, input, (err) => {
      assert.strictEqual(err.message, 'error')
      done()
    })
  })
})
