const nock = require('nock')
const assert = require('assert')

const getUser = require('../../../user/getUser')

const context = {
  meta: {
    userId: 123
  },
  config: {
    magentoUrl: 'http://magento.shopgate.com/shopgate/v2'
  },
  log: {
    error: (message) => {
      console.log(message)
    }
  }
}

const input = {
  token: 'test-token'
}

describe('getUser', () => {
  const magentoResponse = {
    'customer_id': 123,
    'email': 'john.doe@shopgate.com',
    'firstname': 'John',
    'lastname': 'Doe',
    'dob': '2018-06-06 00:00:00',
    'gender': '1',
    'addresses': [{
      'customer_address_id': '113',
      'created_at': '2018-06-01T02:57:49-07:00',
      'updated_at': '2018-06-01 09:57:49',
      'increment_id': null,
      'city': 'Magdeburg',
      'company': 'Shopgate GmbH',
      'country_id': 'DE',
      'fax': null,
      'firstname': 'André',
      'lastname': 'Kraus',
      'middlename': null,
      'postcode': '39122',
      'prefix': null,
      'region': 'Sachsen-Anhalt',
      'region_id': '92',
      'street': 'Olvenstedter Straße 11a',
      'suffix': null,
      'telephone': '01622355954',
      'vat_id': null,
      'vat_is_valid': null,
      'vat_request_date': null,
      'vat_request_id': null,
      'vat_request_success': null,
      'is_default_billing': true,
      'is_default_shipping': false
    }]
  }

  beforeEach(() => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, magentoResponse)
  })

  it('should return valid user data', async () => {
    const userData = await getUser(context, input)
    assert.equal(magentoResponse.email, userData.mail)
    assert.equal(magentoResponse.customer_id, userData.id)
    assert.equal(magentoResponse.firstname, userData.firstName)
    assert.equal(magentoResponse.lastname, userData.lastName)
    assert.equal('2018-06-06', userData.birthday)
    assert.equal('m', userData.gender)

    const magentoAddress = magentoResponse.addresses.pop()
    const userAddress = userData.addresses.pop()

    assert.equal(magentoAddress.customer_address_id, userAddress.id)
    assert.equal('invoice', userAddress.type)
    assert.equal(magentoAddress.firstname, userAddress.firstName)
    assert.equal(magentoAddress.lastname, userAddress.lastName)
    assert.equal(magentoAddress.company, userAddress.company)
    assert.equal(magentoAddress.street, userAddress.street1)
    assert.equal(magentoAddress.city, userAddress.city)
    assert.equal(magentoAddress.telephone, userAddress.phone)
    assert.equal(1, userAddress.isDefault)
    assert.equal(magentoAddress.postcode, userAddress.zipcode)
    assert.equal(magentoAddress.country_id, userAddress.country)
  })

  it('should return valid user data, even if now addresses are exported', async () => {
    delete context.addresses
    const userData = await getUser(context, input)
    assert.equal(magentoResponse.email, userData.mail)
    assert.equal(magentoResponse.customer_id, userData.id)
    assert.equal(magentoResponse.firstname, userData.firstName)
    assert.equal(magentoResponse.lastname, userData.lastName)
    assert.equal('2018-06-06', userData.birthday)
    assert.equal('m', userData.gender)
    assert.deepEqual([], userData.addresses)
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await getUser({}, input)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })
})
