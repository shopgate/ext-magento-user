const assert = require('assert')
const sinon = require('sinon')
const request = require('request-promise-native')
const MageRequest = require('../../../../lib/MagentoRequest')
const deleteAddress = require('../../../../user/address/deleteAddresses')

describe('deleteAddress', () => {
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
    ids: [
      '12',
      '13'
    ]
  }
  let sandbox

  beforeEach(function () {
    sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should call endpoint with all required parameters', async () => {
    const requestStub = sandbox.stub(MageRequest.prototype, 'delete')

    await deleteAddress(context, input)

    assert(requestStub.calledWith(
      `${context.config.magentoUrl}/customers/${input.userId}/addresses?ids=12,13`,
      input.magentoAddress,
      'Request to Magento: deleteAddress')
    )
    requestStub.resetBehavior()
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await deleteAddress({meta: {}}, input)
    } catch (e) {
      assert.strictEqual('EACCESS', e.code)
    }
  })

  it('should return invalid call error because of missing input ids', async () => {
    try {
      await deleteAddress(context, {})
    } catch (e) {
      assert.strictEqual('EINVALIDCALL', e.code)
    }
  })

  it('should return invalid call error because of empty input ids', async () => {
    try {
      await deleteAddress(context, { ids: [] })
    } catch (e) {
      assert.strictEqual('EINVALIDCALL', e.code)
    }
  })

  it('should return invalid call error because of empty string in input ids', async () => {
    try {
      await deleteAddress(context, { ids: [''] })
    } catch (e) {
      assert.strictEqual('EINVALIDCALL', e.code)
    }
  })
})
