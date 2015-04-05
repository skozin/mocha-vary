/*
 * In your tests, use require('mocha-vary') instead of this.
 */
var vary = require('../../..'),
    assert = require('chai').assert,
    Promise = require('bluebird'),
    utils = require('./utils'),
    lib = require('../').withPromiseImpl(Promise)


vary.config.wrapInDescribe(false)


////////////////////////////////////////////////////////////////////////////////////////////////////
describe('lib.pending', function()
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


////////////////////////////////////////////////////////////////////////////////////////////////////
describe('lib.delay(ms, value)', function()
{
  it('is a function', function() {
    assert.isFunction(lib.delay)
  })

  describe('returns a promise which', function() {

    before(function() {
      this.delayed = lib.delay(20, 'some value')
    })

    it('is a real Promise', function() {
      assert.instanceOf(this.delayed, Promise)
    })

    it('is pending', function() {
      return utils.assertPending(this.delayed)
    })
  })
})


/**
 * Only top-level describes can be parametrized.
 */
vary.describe('lib.delay({{0}}, {{1}})', function(delayMs, value)
{
  describe('returns a promise which', function() {

    before(function() {
      this.delayed = lib.delay(delayMs, value)
    })

    it('is resolved after ' + delayMs + ' ms with the value "' + value + '"', function() {
      return utils.assertResolvedWith(value, this.delayed, { waitMs: delayMs + 10 })
    })
  })
})

/**
 * Array is also ok if you don't care about run names.
 */
vary.run([
  {params: [  10, 'a' ]},
  {params: [  50, 'b' ]},
  {params: [ 100, 'c' ]}
])


////////////////////////////////////////////////////////////////////////////////////////////////////
describe('lib.timeout(ms, promise)', function()
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
  })
})


vary.describe('lib.timeout({{0}}, promise)', function(delayMs)
{
  describe('returns a promise which', function() {

    before(function() {
      this.src = lib.delay(delayMs + 100, 'some value')
      this.withTimeout = lib.timeout(delayMs, this.src)
    })

    it('is rejected when the source promise is not resolved within ' + delayMs + ' ms', function() {
      return utils.assertRejectedWith(Error, this.withTimeout, { waitMs: delayMs + 50 })
    })
  })
})


vary.run([
  {params: [  20 ]},
  {params: [  40 ]},
  {params: [ 120 ]}
])
