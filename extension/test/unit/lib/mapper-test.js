const assert = require('assert')
const mapper = require ('../../../lib/mapper')

describe('Attribute Mapper', () => {
  it('should map Shopgate attributes to the code used by Magento', () => {
    assert.equal(mapper.mapShopgateAttributeToMagentoAttribute('middleName'), 'middlename')
    assert.equal(mapper.mapShopgateAttributeToMagentoAttribute('phone'), 'telephone')
    assert.equal(mapper.mapShopgateAttributeToMagentoAttribute('vatId'), 'vat_id')
  })

  it('should return attribute code as they are, when no mapping is present', () => {
    assert.equal(mapper.mapShopgateAttributeToMagentoAttribute('custom_attribute'), 'custom_attribute')
  })
})
