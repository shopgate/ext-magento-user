const nock = require('nock')
const assert = require('assert')
const sinon = require('sinon')

const MagentoRequest = require('../../../lib/MagentoRequest')

const context = {
  meta: {
    userId: 123
  },
  config: {
    magentoUrl: 'http://magento.shopgate.com/shopgate/v2'
  },
  log: {
    error: (message) => {
    }
  }
}

const input = {
  token: 'test-token'
}

const endpointUrl = `${context.config.magentoUrl}/customers/me`

describe('MagentoRequest', () => {
  it('should return unauthorized error because of error code 401', async() => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(401, {})

    try {
      await MagentoRequest.send(endpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })

  it('should return unauthorized error because of error code 403', async() => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(403, {})

    try {
      await MagentoRequest.send(endpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })

  it('should return endpoint not found error because of error code 404', async() => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(404, {})

    try {
      await MagentoRequest.send(endpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EMAGENTOENDPOINTNOTFOUND', e.code)
    }
  })

  it('should return internal error because of error code 405', async() => {
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(405, {})

    try {
      await MagentoRequest.send(endpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EMAGENTOENDPOINTNOTALLOWED', e.code)
    }
  })

  it('should return internal error because of error in response', async() => {
    const errorSpy = sinon.spy(context.log, 'error')
    const errorMessage = 'Something weird going on'
    nock('http://magento.shopgate.com/shopgate/v2')
      .get('/customers/me')
      .reply(200, {
        messages: {
          error: errorMessage
        }
      })

    try {
      await MagentoRequest.send(endpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EINTERNAL', e.code)
      sinon.assert.calledWith(errorSpy, errorMessage)
    }
  })
})
