const assert = require('assert')
const expect = require('chai').expect
const unknownStrategy = require('../../../../user/auth-strategy/unknown')

const context = {}
const input = {
  strategy: null,
  userId: null
}

describe('unknown strategy', () => {

  beforeEach(() => {
    input.strategy = 'test'
    input.userId = 1
  })

  it('should return empty object if an user id was supplied', async () => {
    const result = await unknownStrategy(context, input)
    expect(result).to.eql({})
  })

  it('should throw InvalidCallError if no user id was supplied', async () => {
    input.userId = null
    try {
      await unknownStrategy(context, input)
    } catch (err) {
      return assert.equal(err.code, 'EINVALIDCALL')
    }
    assert.fail('Expected an error to be thrown.')
  })
})
