const expect = require('chai').expect
const utilizeTags = require('../../../../user/address/utilizeTags')

describe('utilizeTags', () => {
  const context = {
    meta: {
      userId: 123
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
    },
    tags: []
  }

  it('should not change anything if no tags are set', async () => {
    const result = await utilizeTags(context, input)
    expect(result.magentoAddress).to.eql(input.magentoAddress)
  })

  it('should set default shipping if tags was set', async () => {
    input.tags = ['default_shipping']

    const result = await utilizeTags(context, input)
    expect(result.magentoAddress).to.have.property('is_default_shipping', 1)
    expect(result.magentoAddress).to.not.have.property('is_default_billing', 1)
  })

  it('should set default billing if tags was set', async () => {
    input.tags = ['default_billing']

    const result = await utilizeTags(context, input)
    expect(result.magentoAddress).to.have.property('is_default_billing', 1)
    expect(result.magentoAddress).to.not.have.property('is_default_shipping', 1)
  })

  it('should set default billing and shipping if both tags were set', async () => {
    input.tags = ['default_billing', 'default_shipping']

    const result = await utilizeTags(context, input)
    expect(result.magentoAddress).to.have.property('is_default_billing', 1)
    expect(result.magentoAddress).to.have.property('is_default_shipping', 1)
  })
})
