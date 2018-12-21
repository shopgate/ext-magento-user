const assert = require('assert')
const expect = require('chai').expect
const facebookStrategy = require('../../../../user/auth-strategy/facebook')

let request = null
const context = {
  config: {
    credentials: {
      email: 'test@shopgate.com'
    },
    magentoUrl: 'https://some.url/shopgate/v2'
  },
  tracedRequest: () => {
    return request
  }
}
const input = {
  strategy: null,
  parameters: {
    profile: null,
    success: null
  }
}

describe('facebook login', () => {
  beforeEach(() => {
    input.strategy = 'facebook'
    input.parameters.success = true
    input.parameters.profile = {
      email: 'test@shopgate.com'
    }
    request = {
      post: () => {}
    }
  })

  it('should return empty object if strategy is not facebook', async () => {
    input.strategy = 'xxx'

    const result = await facebookStrategy(context, input)
    expect(result).to.eql({})
  })

  it('should throw InvalidCredentialsError if login was not successfull', async () => {
    input.parameters.success = false
    try {
      await facebookStrategy(context, input)
    } catch (err) {
      return assert.strictEqual(err.code, 'EINVALIDCREDENTIALS')
    }
    assert.fail('Expected an error to be thrown.')
  })
})
