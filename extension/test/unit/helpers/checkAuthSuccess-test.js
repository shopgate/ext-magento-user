const assert = require('assert')
const step = require('../../../helpers/checkAuthSuccess')

describe('checkAuthSuccess', () => {
  const context = {
    log: {
      error: () => {}
    }
  }

  it('should return successfully', (done) => {
    const input = { authSuccess: true }
    step(context, input, (err) => {
      assert.ifError(err)
      done()
    })
  })

  it('should return an error', (done) => {
    const input = { authSuccess: false }
    step(context, input, (err) => {
      assert.equal(err.message, 'auth step was unsuccessful')
      done()
    })
  })
})
