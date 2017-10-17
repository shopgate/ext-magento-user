const assert = require('assert')
const step = require('../../../token/setToken')

describe('setToken', () => {
  let request = null

  const context = {
    config: {
      credentials: {
        id: 'i1',
        secret: 's1'
      },
      magentoUrl: 'https://some.url'
    },
    storage: {
      user: {
        set: null
      }
    },
    log: {
      debug: (msg) => {}
    },
    tracedRequest: () => {
      return request
    },
    meta: {}
  }

  beforeEach(() => {
    request = {
      post: () => {}
    }
    context.storage.user.set = () => {}
  })

  it('should set the token', (done) => {
    done()
  })
})
