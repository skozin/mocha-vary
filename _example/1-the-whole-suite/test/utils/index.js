var assert = require("chai").assert,
    Promise = require('bluebird')


exports.assertPending = assertPending
exports.assertResolvedWith = assertResolvedWith
exports.assertRejectedWith = assertRejectedWith
exports.assertError = assertError


function assertPending(promise, opts)
{
  return new Promise(function (resolve, reject) {
    function resolved(){ reject(new Error("the promise is not pending (resolved)")) }
    function rejected(){ reject(new Error("the promise is not pending (rejected)")) }
    promise.then(resolved, rejected)
    setTimeout(resolve, !opts || opts.waitMs == undefined ? 10 : opts.waitMs)
  })
}


function assertResolvedWith(value, promise, opts)
{
  return new Promise(function (resolve, reject) {
    function test(v){ assert.strictEqual(v, value) }
    function fail(e){ assert(false, "the promise is rejected") }
    promise.then(test, fail).then(resolve, reject)
    failIfPending(reject, opts)
  })
}


function assertRejectedWith(err, promise, opts)
{
  return new Promise(function (resolve, reject) {
    function test(e){ assertError(e, err) }
    function fail(v){ assert(false, "the promise is resolved") }
    promise.then(fail, test).then(resolve, reject)
    failIfPending(reject, opts)
  })
}


function failIfPending(reject, opts)
{
  function fail(){ reject(new Error("the promise is pending")) }
  setTimeout(fail, !opts || opts.waitMs == undefined ? 10 : opts.waitMs)
}


function assertError(actual, expected)
{
  return ('function' === typeof expected
    ? assert.instanceOf(actual, expected, 'the error has the expected constructor')
    : assert.strictEqual(actual, expected, 'the error is strictly equal the expected one')
  )
}
