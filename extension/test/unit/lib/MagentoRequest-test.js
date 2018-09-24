const nock = require('nock')
const assert = require('assert')
const sinon = require('sinon')
const describe = require('mocha').describe
const it = require('mocha').it
const request = require('request')
const util = require('util')

const MagentoRequest = require('../../../lib/MagentoRequest')
const requestStub = sinon.spy(MagentoRequest, 'send')

const magentoApiUrl = 'http://magento.shopgate.com/shopgate/v2'
const testEndpoint = '/test/endpoint'
const completeEndpointUrl = `${magentoApiUrl}${testEndpoint}`

let input = null
let context = null

describe('MagentoRequest', () => {
  beforeEach(() => {
    input = {
      token: 'testToken'
    }

    context = {
      config: {
        allowSelfSignedCertificate: true
      },
      tracedRequest: () => {
        return request
      },
      log: {
        debug: (object, message) => {
        }
      }
    }
  })

  it('should return unauthorized error because of error code 401', async () => {
    nock(magentoApiUrl)
      .get(testEndpoint)
      .reply(401, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal(e.code, 'EACCESS')
    }
  })

  it('should return magento endpoint not found error because of error code 404', async () => {
    nock(magentoApiUrl)
      .get(testEndpoint)
      .reply(404, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal(e.code, 'EMAGENTOENDPOINTNOTFOUND')
    }
  })

  it('should return magento endpoint not allowed error because of error code 405', async () => {
    nock(magentoApiUrl)
      .get(testEndpoint)
      .reply(405, {})

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal(e.code, 'EMAGENTOENDPOINTNOTALLOWED')
    }
  })

  it('should return error because of error in response', async () => {
    nock(magentoApiUrl)
      .get(testEndpoint)
      .reply(401, {
        messages: {
          error: 'fancy error message'
        },
        headers: {}
      })

    try {
      await MagentoRequest.send(completeEndpointUrl, context, input.token)
    } catch (e) {
      assert.equal(e.name, 'Error')
    }
  })

  it('should return a valid response', async () => {
    const debugLogSpy = sinon.spy(context.log, 'debug')
    nock(magentoApiUrl)
      .get(testEndpoint)
      .reply(200, 'ok')

    const result = await MagentoRequest.send(completeEndpointUrl, context, input.token)

    assert.equal(result, 'ok')
    sinon.assert.calledWith(debugLogSpy, {
      duration: 0,
      statusCode: 200,
      request: util.inspect({
        url: completeEndpointUrl,
        method: 'GET',
        json: true,
        rejectUnauthorized: false,
        auth: {
          bearer: input.token
        }
      }, true, 5),
      response: {
        body: 'ok',
        headers: {}
      }
    }, 'Request to Magento')
  })

  it('should trigger a POST request to magento', async () => {
    nock(magentoApiUrl)
      .post(testEndpoint)
      .reply(200, 'ok')

    const postData = {
      post: true
    }

    await MagentoRequest.post(completeEndpointUrl, context, input.token, postData)
    sinon.assert.calledWith(requestStub, completeEndpointUrl, context, input.token, 'Request to Magento', 'POST', postData)
  })

  it('should trigger a DELETE request to magento', async () => {
    nock(magentoApiUrl)
      .delete(testEndpoint)
      .reply(200, 'ok')

    const postData = {
      post: true
    }

    await MagentoRequest.delete(completeEndpointUrl, context, input.token, postData)
    sinon.assert.calledWith(requestStub, completeEndpointUrl, context, input.token, 'Request to Magento', 'DELETE', postData)
  })
})
