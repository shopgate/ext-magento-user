/**
 * Property: name of the attribute at Shopgate
 * Value of property: name of the corresponding attribute at Magento
 *
 * @type {{middleName: string, phone: string, vatId: string}}
 */
const attributeMap = {
  middleName: 'middlename',
  phone: 'telephone',
  vatId: 'vat_id'
}

/**
 * Just maps a given attribute code from Shopgate to the attribute code used in Magento
 *
 * @param {string} [attributeCode] - attribute code used by Shopgate
 * @returns {string} - attribute code used by Magento
 */
module.exports.mapShopgateAttributeToMagentoAttribute = function (attributeCode) {
  return attributeMap.hasOwnProperty(attributeCode) ? attributeMap[attributeCode] : attributeCode
}
