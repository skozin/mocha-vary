/*
 * In your tests, use require('mocha-vary').describe instead of this.
 */
var describe = require('../../..').describe,
    assert = require('chai').assert,
    utils = require('./utils')


describe('lib.pending()', function(lib, Promise)
{
  it('is a function', function() {
    assert.isFunction(lib.pending)
  })

  describe('returns an object containing three fields:', function() {
    before(function() {
      this.pending = lib.pending()
    })

    describe('resolve, which', function() {
      it('is a function', function() {
        assert.isFunction(this.pending.resolve)
      })
    })

    describe('reject, which', function() {
      it('is a function', function() {
        assert.isFunction(this.pending.reject)
      })
    })

    describe('promise, which', function() {
      it('is a real Promise', function() {
        assert.instanceOf(this.pending.promise, Promise)
      })

      it('is pending', function() {
        return utils.assertPending(this.pending.promise)
      })

      it('is resolved with a given value after calling resolve(value)', function() {
        this.pending.resolve(42)
        return utils.assertResolvedWith(42, this.pending.promise)
      })

      it('is rejected with a given reason after calling reject(reason)', function() {
        var err = new Error('oh no!')
        this.pending = lib.pending()
        this.pending.reject(err)
        return utils.assertRejectedWith(err, this.pending.promise)
      })
    })
  })
})
