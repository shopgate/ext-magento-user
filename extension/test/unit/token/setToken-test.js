const assert = require('assert')
const step = require('../../../token/setToken')

describe('setToken', () => {
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
      user: {
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

  const input = {
    magentoTokenResponse: {
      tokens: {
        accessToken: 'a1',
        refreshToken: 'r1'
      },
      expires: (new Date()).getTime()
    }
  }

  beforeEach(() => {
    request = {
      post: () => {}
    }
    context.storage.user.set = () => {}
  })

  it('should set the token', (done) => {
    context.storage.user.set = (key, value, cb) => { cb(null) }

    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error', (done) => {
    context.storage.user.set = (key, value, cb) => { cb(new Error('error')) }

    step(context, input, (err) => {
      assert.equal(err.message, 'error')
      done()
    })
  })
})
