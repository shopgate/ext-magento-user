const nock = require('nock')
const assert = require('assert')
const sinon = require('sinon')
const describe = require('mocha').describe
const it = require('mocha').it

const MagentoRequest = require('../../../lib/MagentoRequest')

const magentoApiUrl = 'http://magento.shopgate.com/shopgate/v2'
const meEndpoint = '/customers/me'
const completeEndpointUrl = `${magentoApiUrl}${meEndpoint}`

const context = {
  meta: {
    userId: 123
  },
  config: {
    magentoUrl: magentoApiUrl
  },
  log: {
    error: (message) => {
    }
  }
}

const input = {
  token: 'test-token'
}

describe('MagentoRequest', () => {
  it('should return unauthorized error because of error code 401', async () => {
    nock(magentoApiUrl)
      .get(meEndpoint)
      .reply(401, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })

  it('should return unauthorized error because of error code 403', async () => {
    nock(magentoApiUrl)
      .get(meEndpoint)
      .reply(403, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EACCESS', e.code)
    }
  })

  it('should return endpoint not found error because of error code 404', async () => {
    nock(magentoApiUrl)
      .get(meEndpoint)
      .reply(404, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EMAGENTOENDPOINTNOTFOUND', e.code)
    }
  })

  it('should return internal error because of error code 405', async () => {
    nock(magentoApiUrl)
      .get(meEndpoint)
      .reply(405, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EMAGENTOENDPOINTNOTALLOWED', e.code)
    }
  })

  it('should return internal error because of error in response', async () => {
    const errorSpy = sinon.spy(context.log, 'error')
    const errorMessage = 'Something weird going on'
    nock(magentoApiUrl)
      .get(meEndpoint)
      .reply(200, {
        messages: {
          error: errorMessage
        }
      })

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal('EINTERNAL', e.code)
      sinon.assert.calledWith(errorSpy, errorMessage)
    }
  })
})
