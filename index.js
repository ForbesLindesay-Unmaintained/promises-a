(function () {
  function promise() {
    var resolved = false,
        fulfilled = false,
        val,
        waiting = [], running = false;

    function next() {
      if (waiting.length) {
        running = true;
        waiting.shift()();
      } else {
        running = false;
      }
    }
    function then(cb, eb, pb) {
      var def = promise();
      function done() {
        var callback = fulfilled ? cb : eb;
        if (callback) {
          setTimeout(function () {
            var value;
            try {
              value = callback(val);
            } catch (ex) {
              def.reject(ex);
              return next();
            }
            def.fulfill(value);
            next();
          }, 0);
        } else if (fulfilled) {
          def.fulfill(val);
          next();
        } else {
          def.reject(val);
          next();
        }
      }
      waiting.push(done);
      if (resolved && !running) {
        next();
      }
      return def.promise;
    }
    function resolve(success, value) {
      if (resolved) return;
      if (success && typeof value === 'object' && typeof value.then === 'function') {
        value.then(fulfill, reject);
        return;
      }
      resolved = true;
      fulfilled = success;
      val = value;
      next();
    }
    function fulfill(val) {
      resolve(true, val);
    }
    function reject(err) {
      resolve(false, err);
    }

    return {promise: {then: then}, fulfill: fulfill, reject: reject};
  };
  
  if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
    module.exports = promise;
  } else {
    window.promise = promise;
  }
}());