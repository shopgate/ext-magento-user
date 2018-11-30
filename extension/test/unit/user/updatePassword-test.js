const assert = require('assert')
const sinon = require('sinon')
const request = require('request-promise-native')
const MageRequest = require('../../../lib/MagentoRequest')
const updatePassword = require('../../../user/updatePassword')

describe('updatePassword', () => {
  const context = {
    meta: {
      userId: 123
    },
    tracedRequest: () => {
      return request
    },
    config: {
      magentoUrl: 'http://magento.shopgate.com/shopgate/v2'
    },
    log: {
      error: (message) => {
      },
      debug: (message) => {
      }
    }
  }

  const input = {
    token: 'test-token',
    userId: context.meta.userId,
    password: 'password',
    oldPassword: 'oldPassword'
  }
  let sandbox

  beforeEach(function () {
    sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should call endpoint with all required parameters', async () => {
    const requestStub = sandbox.stub(MageRequest.prototype, 'post')

    await updatePassword(context, input)

    assert(requestStub.calledWith(
      `${context.config.magentoUrl}/customers/${input.userId}/password`,
      { password: input.password, oldPassword: input.oldPassword },
      'Request to Magento: updatePassword')
    )
    requestStub.resetBehavior()
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await updatePassword({ meta: {} }, input)
    } catch (e) {
      assert.strictEqual('EACCESS', e.code)
    }
  })
})
