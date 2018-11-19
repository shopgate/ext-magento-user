const assert = require('assert')
const provinceCodeMapper = require('../../../helpers/provinceMapper')

describe('provinceCodeMapper', () => {
  describe('get Magento code from ISO code', () => {
    it('should map DE BE to BER', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('DE', 'BE'), 'BER')
    })
    it('should map AT 9 to WI', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('AT', '9'), 'WI')
    })
    it('should map ES B to Barcelona', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('ES', 'B'), 'Barcelona')
    })
    it('should map LT TE to LT-TE', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('LT', 'TE'), 'LT-TE')
    })
    it('should map FI 10 to Lappi', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('FI', '10'), 'Lappi')
    })
    it('should map LV 019 to Burtnieku novads', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('LV', '019'), 'Burtnieku novads')
    })
    it('should map an unknown code to itself', () => {
      assert.equal(provinceCodeMapper.getMagentoRegion('US', 'TX'), 'TX')
    })
  })

  describe('get ISO code from Magento code', () => {
    it('should map DE BER to BE', () => {
      assert.equal(provinceCodeMapper.getProvince('DE', 'BER'), 'BE')
    })
    it('should map AT WI to 9', () => {
      assert.equal(provinceCodeMapper.getProvince('AT', 'WI'), '9')
    })
    it('should map ES Barcelona to B', () => {
      assert.equal(provinceCodeMapper.getProvince('ES', 'Barcelona'), 'B')
    })
    it('should map LT LT-TE to TE', () => {
      assert.equal(provinceCodeMapper.getProvince('LT', 'LT-TE'), 'TE')
    })
    it('should map FI Lappi to 10', () => {
      assert.equal(provinceCodeMapper.getProvince('FI', 'Lappi'), '10')
    })
    it('should map LV Burtnieku novads to 019', () => {
      assert.equal(provinceCodeMapper.getProvince('LV', 'Burtnieku novads'), '019')
    })
    it('should map an unknown code to itself', () => {
      assert.equal(provinceCodeMapper.getProvince('US', 'TX'), 'TX')
    })
  })
})
