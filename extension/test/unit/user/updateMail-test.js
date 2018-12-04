const assert = require('assert')
const sinon = require('sinon')
const request = require('request-promise-native')
const MageRequest = require('../../../lib/MagentoRequest')
const updateMail = require('../../../user/updateMail')

describe('updateMail', () => {
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
    mail: 'tester@shopgate.com'
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

    await updateMail(context, input)

    assert(requestStub.calledWith(
      `${context.config.magentoUrl}/customers/${input.userId}/email`,
      { email: input.mail },
      'Request to Magento: updateMail')
    )
    requestStub.resetBehavior()
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await updateMail({ meta: {} }, input)
    } catch (e) {
      assert.strictEqual('EACCESS', e.code)
    }
  })
})
