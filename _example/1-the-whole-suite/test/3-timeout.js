/*
 * In your tests, use require('mocha-vary').describe instead of this.
 */
var describe = require('../../..').describe,
    assert = require('chai').assert,
    utils = require('./utils')


var describeWhenCancellable = describe.whenNot('es6-promise, native')


describeWhenCancellable('lib.timeout(ms, promise)', function(lib, Promise)
{
  it('is a function', function() {
    assert.isFunction(lib.timeout)
  })

  describe('returns a promise which', function() {
    before(function() {
      this.src = lib.delay(50, 'some value')
      this.withTimeout = lib.timeout(100, this.src)
    })

    it('is a real Promise', function() {
      assert.instanceOf(this.withTimeout, Promise)
    })

    it('is pending', function() {
      return utils.assertPending(this.withTimeout)
    })

    it('is cancellable', function() {
      assert.isTrue(this.withTimeout.isCancellable())
    })

    it('is resolved with the same value when the source Promise is resolved', function() {
      return utils.assertResolvedWith('some value', this.withTimeout, { waitMs: 60 })
    })

    it('is rejected with the same reason when the source Promise is rejected', function () {
      var err = new Error('oops...')
      this.src = lib.pending()
      this.withTimeout = lib.timeout(100, this.src.promise)
      this.src.reject(err)
      return utils.assertRejectedWith(err, this.withTimeout)
    })

    it('is rejected when the source promise is not resolved within a given amount of time',
      function() {
        this.src = lib.delay(100, 'some value')
        this.withTimeout = lib.timeout(50, this.src)
        return utils.assertRejectedWith(Error, this.withTimeout, {
          waitMs: 70
        })
      }
    )
  })
})
