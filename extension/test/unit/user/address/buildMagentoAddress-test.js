const expect = require('chai').expect
const buildMagentoAddress = require('../../../../user/address/buildMagentoAddress')

describe('buildMagentoAddress', () => {
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

  it('should map shopgate to magento address', async () => {
    const expectedAddress = {
      firstname: 'firstname',
      lastname: 'lastname',
      postcode: 'zipCode',
      city: 'city',
      region: 'AZ',
      country_id: 'US',
      street: [
        'street1',
        'street2'
      ],
      company: 'company',
      telephone: 'telephone',
      fax: 'fax',
      vat_id: 'vat_id',
      suffix: 'suffix',
      prefix: 'prefix',
      middlename: 'middlename'
    }

    const result = await buildMagentoAddress(context, input)
    expect(result.magentoAddress).to.eql(expectedAddress)
  })
})
