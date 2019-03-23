const assert = require('assert').strict
const newman = require('newman')

describe('Newman code coverage', () => {
  it('should run the postman test collection correctly', function (done) {
    this.timeout(600000)
    newman.run({
      collection: (require('../newman/collection.json')),
      globals: (require('../newman/globals.json')),
      environment: (require('../newman/environment.json')),
      reporters: 'cli'
    }, (err, summary) => {
      if (err || summary.run.failures.length) {
        assert.ok(false, `Failures encountered: ${summary.run.failures.length}`)
        return done(err)
      }
      done()
    })
  })
})
