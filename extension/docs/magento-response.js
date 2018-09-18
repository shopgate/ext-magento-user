/**
 * @typedef {Object} MagentoResponseUser
 * @property {string} customer_id - id of the customer
 * @property {string} created_at - when the customer was created, e.g. "2018-02-28 03:59:05"
 * @property {string} [updated_at] - when the customer was updated last, e.g. "2018-02-28 03:59:05"
 * @property {string} store_id - id of the store
 * @property {string} website_id - id of the website
 * @property {string} [confirmation] - whether customer confirmed their email
 * @property {string} created_in - store where the customer are created
 * @property {string} [default_billing] - default billing address id
 * @property {string} [default_shipping] - default shipping address id
 * @property {string} disable_auto_group_change - defines whether the automatic group change for the customer will be disabled
 * @property {string} [dob] - date of birth
 * @property {string} email - email address of customer
 * @property {string} firstname - customers first name
 * @property {string} [gender] - customers gender
 * @property {string} group_id - group id uf customer
 * @property {string} [lastname] - customers last name
 * @property {string} [middlename] - customers middle name
 * @property {string} [prefix] - customers prefix
 * @property {string} [reward_update_notification] - reward update notifications
 * @property {string} [reward_warning_notification] - reward warning notifications
 * @property {string} [rp_token] - customers rp_token
 * @property {string} [rp_token_created_at] - customers rp_token created at
 * @property {string} [suffix] - customer's suffix
 * @property {string} [taxvat] - customer's VAT id
 * @property {MagentoResponseUserCustomerGroup} customer_group
 */

/**
 * @typedef {Object} MagentoResponseUserCustomerGroup
 * @property {string} customer_group_id - id of the customer group
 * @property {string} customer_group_code - customer group code, e.g. "Default"
 * @property {string} [tax_class_id] - customer group tax class id
 */
