;(function () {
  function promise() {
    var resolved = false,
        fulfilled = false,
        val,
        waiting = [],
        running = false,
        prom = {then: then, valueOf: valueOf, done: done}

    function next(skipTimeout) {
      if (waiting.length) {
        running = true
        waiting.shift()(skipTimeout || false)
      } else {
        running = false
      }
    }
    function then(cb, eb) {
      var def = promise()
      function done(skipTimeout) {
        var callback = fulfilled ? cb : eb
        if (typeof callback === 'function') {
          function timeoutDone() {
            var value;
            try {
              value = callback(val)
            } catch (ex) {
              def.reject(ex)
              return next()
            }
            def.fulfill(value);
            next(true);
          }
          if (skipTimeout) timeoutDone();
          else setTimeout(timeoutDone, 0)
        } else if (fulfilled) {
          def.fulfill(val)
          next(skipTimeout)
        } else {
          def.reject(val)
          next(skipTimeout)
        }
      }
      waiting.push(done);
      if (resolved && !running) {
        next()
      }
      return def.promise
    }
    function resolve(success, value) {
      if (resolved) return;
      if (success  && value && typeof value.then === 'function') {
        value.then(fulfill, reject)
        return
      }
      resolved = true
      fulfilled = success
      val = value
      next()
    }
    function fulfill(val) {
      resolve(true, val)
    }
    function reject(err) {
      resolve(false, err)
    }

    function valueOf() {
      return fulfilled ? val : prom;
    }


    function done(cb, eb) {
      var p = this; // support 'hot' promises
      if (cb || eb) {
        p = p.then(cb, eb)
      }
      p.then(null, function (reason) {
        setTimeout(function () {
          throw reason
        }, 0)
      })
    }

    return {
      promise: prom,
      fulfill: fulfill,
      reject: reject
    }
  }
  
  if (typeof module != 'undefined' && typeof module.exports != 'undefined')
    module.exports = promise
  else
    window.promise = promise
}())