/*
 * In your tests, use require('mocha-vary').describe instead of this.
 */
var describe = require('../../../..').describe,
    assert = require('chai').assert,
    utils = require('../utils')


describe('lib.delay(ms, value)', function(lib, Promise)
{
  it('is a function', function() {
    assert.isFunction(lib.delay)
  })

  describe('returns a promise which', function() {
    before(function() {
      this.delayed = lib.delay(100, 'some value')
    })

    it('is a real Promise', function() {
      assert.instanceOf(this.delayed, Promise)
    })

    it('is pending', function() {
      return utils.assertPending(this.delayed)
    })

    it('is resolved after a given amount of time with a given value', function() {
      return utils.assertResolvedWith('some value', this.delayed, { waitMs: 110 })
    })
  })
})
