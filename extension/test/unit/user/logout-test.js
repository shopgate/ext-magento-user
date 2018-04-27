const assert = require('assert')
const step = require('../../../user/logout')

describe('logout', () => {
  const context = {
    config: {
      magentoUrl: 'http://some.url'
    },
    storage: {
      device: {
        del: null
      }
    },
    log: {
      debug: () => {}
    }
  }

  beforeEach(() => {
    context.storage.device.del = () => {}
  })

  it('should logout the user by deleting the tokens from device storage', (done) => {
    context.storage.device.del = (key, cb) => { cb(null) }
    step(context, null, (err, result) => {
      assert.ifError(err)
      assert.ok(result.success)
      done()
    })
  })

  it('should return an error because deletion failed', (done) => {
    context.storage.device.del = (key, cb) => { cb(new Error('error')) }
    step(context, null, (err, result) => {
      assert.equal(err.message, 'error')
      done()
    })
  })
})
