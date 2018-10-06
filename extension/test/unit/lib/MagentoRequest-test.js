const nock = require('nock')
const assert = require('assert')
const sinon = require('sinon')
const describe = require('mocha').describe
const it = require('mocha').it
const request = require('request-promise-native')
const util = require('util')

const MagentoRequest = require('../../../lib/MagentoRequest')
const UnauthorizedError = require('../../../models/Errors/UnauthorizedError')
const EndpointNotFound = require('../../../models/Errors/MagentoEndpointNotFoundError')
const EndpointNotAllowed = require('../../../models/Errors/MagentoEndpointNotAllowedError')
const FieldValidationError = require('../../../models/Errors/FieldValidationError')
const EndpointError = require('../../../models/Errors/MagentoEndpointError')

const magentoUrl = 'http://magento.shopgate.com/shopgate/v2'
const path = '/test/endpoint'

let input = null
let context = null
let mageRequest = null
let requestStub = null

describe('MagentoRequest', () => {
  beforeEach(() => {
    input = {
      token: 'testToken'
    }

    context = {
      config: {
        allowSelfSignedCertificate: true
      },
      tracedRequest: () => request,
      log: {
        debug: (object, message) => {
        }
      }
    }
    mageRequest = new MagentoRequest(context, input.token)
    requestStub = sinon.spy(mageRequest, 'send')
  })

  it('Returns proper validation error', async () => {
    const pathName = 'city'
    const messages = [
      '"First Name" is a required value.',
      '"First Name" length must be equal or greater than 1 characters.'
    ]
    const response = {
      messages: {
        error: [
          {
            path: pathName,
            messages
          }
        ]
      }
    }
    nock(magentoUrl).get(path).reply(400, response)
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch((error) => {
        assert(error instanceof FieldValidationError, 'Improper error returned')
        assert.equal(error.validationErrors[0].message, messages.join(' '))
        assert.equal(error.validationErrors[0].path, pathName)
      })
  })

  it('Returns proper Unauthorized error', async () => {
    nock(magentoUrl).get(path).reply(401, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof UnauthorizedError, 'Improper error returned'))
  })

  it('Returns proper Unauthorized error', async () => {
    nock(magentoUrl).get(path).reply(403, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof UnauthorizedError, 'Improper error returned'))
  })

  it('Returns proper 404 error', async () => {
    nock(magentoUrl).get(path).reply(404, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointNotFound, 'Improper error returned'))
  })

  it('Returns proper 405 error', async () => {
    nock(magentoUrl).get(path).reply(405, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointNotAllowed, 'Improper error returned'))
  })

  it('Returns proper 500 error', async () => {
    nock(magentoUrl).get(path).reply(500, {})
    // noinspection JSUnusedLocalSymbols
    await mageRequest.send(magentoUrl + path)
      .then(result => assert(false, 'Should not be successful'))
      .catch(error => assert(error instanceof EndpointError, 'Improper error returned'))
  })

  // todo-sg: fix
  it('should return a valid response', async () => {
    const debugLogSpy = sinon.spy(context.log, 'debug')
    nock(magentoUrl)
      .get(path)
      .reply(200, 'ok')

    const result = await mageRequest.send(magentoUrl + path)

    assert.equal(result, 'ok')
    sinon.assert.calledWith(debugLogSpy, {
      statusCode: 200,
      request: util.inspect({
        url: magentoUrl + path,
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
    nock(magentoUrl)
      .post(path)
      .reply(200, 'ok')

    const postData = {
      post: true
    }

    await mageRequest.post(magentoUrl + path, postData)
    sinon.assert.calledWith(requestStub, magentoUrl + path, 'Request to Magento', 'POST', postData)
  })

  it('should trigger a DELETE request to magento', async () => {
    nock(magentoUrl)
      .delete(path)
      .reply(200, 'ok')

    const postData = {
      post: true
    }

    await mageRequest.delete(magentoUrl + path, postData)
    sinon.assert.calledWith(requestStub, magentoUrl + path, 'Request to Magento', 'DELETE', postData)
  })
})
