/**
 * Creates specific UTM-Parameters to be added to an URL.
 *
 * @example /utm_source/yourSource/utm_medium/yourMedium
 */
class UtmParameters {

  /**
   * Can be used with setter/getter or with the config-source where those parameters are defined
   * @param configSource
   */
  constructor (configSource = null) {

    if (!configSource) {
      this._source    = null
      this._medium    = null
      this._campaign  = null
      this._term      = null
      this._content   = null
    } else {
      this._source    = configSource.utm_source
      this._medium    = configSource.utm_medium
      this._campaign  = configSource.utm_campaign
      this._term      = configSource.utm_term
      this._content   = configSource.utm_content
    }
  }

  get source () {
    return this._source
  }

  set source (value) {
    this._source = value
  }

  get medium () {
    return this._medium
  }

  set medium (value) {
    this._medium = value
  }

  get campaign () {
    return this._campaign
  }

  set campaign (value) {
    this._campaign = value
  }

  get term () {
    return this._term
  }

  set term (value) {
    this._term = value
  }

  get content () {
    return this._content
  }

  set content (value) {
    this._content = value
  }

  /**
   * Concats all parameters to URL-Query, which can be added to an URL
   * As Magento uses not URL-Query-Parameters, but Router-Parameters, the format of these are fitting for the
   * Magento-Routing.
   * @TODO Create another function which can be used to create Query-Parameters like ?utm_source=abc&utm_medium=def...
   * @returns {string}
   */
  getQueryParameters() {
    let queryParameters = '';

    if (this.source)
      queryParameters += 'utm_source/' + this.source + '/'

    if (this.medium)
      queryParameters += 'utm_medium/' + this.medium + '/'

    if (this.campaign)
      queryParameters += 'utm_campaign/' + this.campaign + '/'

    if (this.term)
      queryParameters += 'utm_term/' + this.term + '/'

    if (this.content)
      queryParameters += 'utm_content/' + this.content + '/'

    return queryParameters
  }
}

module.exports = UtmParameters