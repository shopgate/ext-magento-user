const removeProperties = require('../../../../user/address/removeEmptyProperties')
const expect = require('chai').expect

describe('removeEmptyProperties', () => {
  it('should remove street if it is empty', async () => {
    const input = {
      magentoAddress: {
        street: ''
      }
    }

    const result = await removeProperties({}, input)
    expect(result.magentoAddress).to.not.have.property('street')
  })

  it('should not remove the street if it is not empty', async () => {
    const input = {
      magentoAddress: {
        street: 'straße 1'
      }
    }

    const result = await removeProperties({}, input)
    expect(result.magentoAddress).to.have.property('street')
  })
})
