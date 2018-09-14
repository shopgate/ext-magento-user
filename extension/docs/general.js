/**
 * This file will document all generally used objects across pipelines and steps
 */
/**
 * @typedef {Object} StepContext
 * @property {Logger} log - allows logging information to the backend console
 * @property {StepContextConfig} config - Configuration file, reference config.json for values
 * @property {function} tracedRequest - Request class allows making external REST calls
 * @property {StepContextMeta} meta
 * @property {StepContextStorageContainer} storage - defines different types of storage's to save intermediate data to
 */
/**
 * @typedef {(Object|Array)} StepContextStorageContainer
 * @property {StepContextStorage} user - temporary user related storage that saves or retrieves data
 * @property {StepContextStorage} device  - temporary anonymous device storage that saves or retrieves data
 */
/**
 * @typedef {Object} StepContextStorage
 * @function get - retrieve storage data
 * @function set - set storage data
 * @function del - remove storage data
 */
/**
 * @typedef {Object} StepContextConfig
 * @property {string} magentoUrl
 * @property {StepContextCredentials} credentials
 */
/**
 * @typedef {Object} StepContextMeta
 * @property {(string|null)} userId
 */
/**
 * @typedef {Object} StepContextCredentials
 * @property {string} id - id of the interface, usually in [customer_number]-[shop_number] format
 * @property {string} secret - the API key of the interface
 */
/**
 * @callback StepCallback
 * @param {?Error} error - an error that can be passed to the callback
 * @param {?Object} result - a valid json key/value to return to the pipeline
 */
/**
 * @typedef {Object} MagentoAddress
 * @property {Object} address
 * @property {string} entity_id
 * @property {string} [entity_type_id]
 * @property {string} [attribute_set_id]
 * @property {string} [increment_id]
 * @property {string} [parent_id]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} [is_active]
 * @property {string} [firstname]
 * @property {string} [middlename]
 * @property {string} [lastname]
 * @property {string} [company]
 * @property {string} [city]
 * @property {string} [country_id] - short name of country, e.g. US (ISO2)
 * @property {string} [region] - full region name, e.g. Arizona
 * @property {string} [postcode]
 * @property {string} [telephone]
 * @property {string} [fax]
 * @property {string} [prefix]
 * @property {string} [suffix]
 * @property {string} [vat_id]
 * @property {string} [region_id] - database id of region
 * @property {string} [region_code] - database code of the region, ISO2 for USA
 * @property {Array} [street]
 * @property {string} [customer_id]
 * @property {Object} [customAttributes]
 * @property {number} [is_default_billing]
 * @property {number} [is_default_shipping]
 */
/**
 * @typedef {Object} ShopgateAddress
 * @property {Object} address
 * @property {string} id
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [street1]
 * @property {string} [street2]
 * @property {string} [city]
 * @property {string} [zipCode] - zip code of country
 * @property {string} country - short name of country, e.g. US (ISO2)
 * @property {string} [province] - short name of province/region/state, e.g. AZ (ISO2)
 * @property {string[]} [tags] - list of cart specific tags, e.g. 'default', 'billing', etc.
 * @property {ShopgateAddressCustomAttributes} [customAttributes]
 */
/**
 * @typedef {Object} ShopgateAddressCustomAttributes
 * @property {string} [middleName]
 * @property {string} [prefix]
 * @property {string} [suffix]
 * @property {string} [phone]
 * @property {string} [fax]
 * @property {string} [company]
 * @property {string} [vatId]
 */
/**
 * @typedef {Object} ShopgateUserCustomAttributes
 * @property {string} [middleName]
 */
