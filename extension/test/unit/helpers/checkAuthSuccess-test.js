const assert = require('assert')
const step = require('../../../helpers/checkAuthSuccess')

describe('checkAuthSuccess', async () => {
  const context = {
    log: {
      error: () => {}
    }
  }

  it('should return successfully', async () => {
    const input = { authSuccess: true }
    try {
      await step(context, input)
    } catch (e) {
      assert.fail('Expected NO error to be thrown.')
    }
  })

  it('should return an error', async () => {
    const input = { authSuccess: false }
    try {
      await step(context, input)
    } catch (e) {
      assert.strictEqual('EACCESS', e.code)
    }
  })
})
