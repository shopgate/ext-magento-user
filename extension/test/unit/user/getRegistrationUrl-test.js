const assert = require('assert')
const getRegistrationUrl = require('../../../user/getRegistrationUrl')

describe('getRegistrationUrl', () => {
  const context = {
    config: {
      registrationUrl: 'http://magento.shopgate.com/customer/account/create/',
      utmParameters: {
        utm_source: 'utm_source',
        utm_medium: 'utm_medium',
        utm_campaign: 'utm_campaign',
        utm_term: 'utm_term',
        utm_content: 'utm_content'
      }
    }
  }

  it('should return registration url including shopgate app parameter', (done) => {
    const expectedUrl = 'http://magento.shopgate.com/customer/account/create/sgcloud_inapp/1/utm_source/utm_source/utm_medium/utm_medium/utm_campaign/utm_campaign/utm_term/utm_term/utm_content/utm_content/'

    getRegistrationUrl(context, {}, (err, result) => {
      assert.ifError(err)
      assert.strictEqual(result.url, expectedUrl)
      done()
    })
  })
})
