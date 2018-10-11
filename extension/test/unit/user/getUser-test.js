const nock = require('nock')
const assert = require('assert')
const request = require('request-promise-native')
const getUser = require('../../../user/getUser')

describe('getUser', () => {
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
    token: 'test-token'
  }

  const magentoResponse = {
    'customer_id': 123,
    'email': 'john.doe@shopgate.com',
    'firstname': 'John',
    'lastname': 'Doe',
    'customer_group': {
      'customer_group_id': 8,
      'customer_group_code': 'Default'
    },
    'dob': '2018-06-06 00:00:00',
    'gender': '1',
    'middlename': 'von'
  }

  it('should return valid minimum user data', async () => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, magentoResponse)

    const userData = await getUser(context, input)
    assert.equal(magentoResponse.email, userData.mail)
    assert.equal(magentoResponse.customer_id, userData.id)
  })

  it('should return valid user data with user group and custom attributes', async () => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, magentoResponse)

    const userData = await getUser(context, input)
    assert.equal(magentoResponse.email, userData.mail)
    assert.equal(magentoResponse.customer_id, userData.id)
    assert.equal(magentoResponse.firstname, userData.firstName)
    assert.equal(magentoResponse.lastname, userData.lastName)

    const magentoCustomerGroup = magentoResponse.customer_group
    const userGroup = userData.userGroups.pop()
    assert.equal(magentoCustomerGroup.customer_group_id, userGroup.id)
    assert.equal(magentoCustomerGroup.customer_group_code, userGroup.name)

    const customAttributes = userData.customAttributes
    assert.equal(magentoResponse.dob, customAttributes.dob)
    assert.equal(magentoResponse.gender, customAttributes.gender)
    assert.equal(magentoResponse.middlename, customAttributes.middlename)
  })

  it('should return valid user data, even if no userGroups are exported', async () => {
    let customResponse = { ...magentoResponse }
    delete customResponse.customer_group

    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, customResponse)

    const userData = await getUser(context, input)
    assert.equal(magentoResponse.email, userData.mail)
    assert.equal(magentoResponse.customer_id, userData.id)
    assert.deepEqual(userData.userGroups, undefined)
  })

  it('should return valid user data, even if no customAttributes are exported', async () => {
    let customResponse = { ...magentoResponse }
    delete customResponse.dob
    delete customResponse.gender
    delete customResponse.middlename

    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, customResponse)

    const userData = await getUser(context, input)
    assert.equal(userData.mail, magentoResponse.email)
    assert.equal(userData.id, magentoResponse.customer_id)
    assert.deepEqual(userData.customAttributes, {})
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await getUser({meta: {}}, input)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })
})
