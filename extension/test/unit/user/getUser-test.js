const nock = require('nock')
const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before

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
    'lastname': 'Doe'
  }

  before(() => {
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
  })

  it('should return unauthorized error because of missing context.meta', async () => {
    try {
      await getUser({}, input)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })
})
