

exports.withPromiseImpl = function withPromiseImpl(Promise)
{
  function delay(ms, value) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms, value)
    })
  }

  function pending() {
    var resolve, reject, promise = new Promise(function(res, rej) {
      resolve = res
      reject = rej
    })
    return {
      promise: promise,
      resolve: resolve,
      reject: reject
    }
  }

  function timeout(ms, promise) {
    var cPromise = promise.cancellable(),
        tmId = setTimeout(onTimeout, ms)
    function onTimeout() {
      cPromise.cancel(new Error('timeout'))
      tmId = undefined
    }
    function onSettled() {
      if (tmId != undefined) {
        clearTimeout(tmId)
      }
    }
    return cPromise.finally(onSettled)
  }

  return {
    delay: delay,
    pending: pending,
    timeout: timeout
  }
}
