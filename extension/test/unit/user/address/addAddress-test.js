const assert = require('assert')
const sinon = require('sinon')
const request = require('request-promise-native')
const MageRequest = require('../../../../lib/MagentoRequest')
const addAddress = require('../../../../user/address/addAddress')

describe('addAddress', () => {
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
    userId: context.meta.userId,
    magentoAddress: {
      'firstName': 'firstname',
      'lastName': 'lastname',
      'street1': 'street1',
      'street2': 'street2',
      'city': 'city',
      'zipCode': 'zipCode',
      'country': 'US',
      'province': 'AZ',
      'tags': [],
      'customAttributes': {
        'company': 'company',
        'telephone': 'telephone',
        'fax': 'fax',
        'vat_id': 'vat_id',
        'suffix': 'suffix',
        'prefix': 'prefix',
        'middlename': 'middlename'
      }
    }
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

    await addAddress(context, input)

    assert(requestStub.calledWith(
      `${context.config.magentoUrl}/customers/${input.userId}/addresses`,
      input.magentoAddress,
      'Request to Magento: addAddress')
    )
    requestStub.resetBehavior()
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await addAddress({ meta: {} }, input)
    } catch (e) {
      assert.strictEqual('EACCESS', e.code)
    }
  })
})
