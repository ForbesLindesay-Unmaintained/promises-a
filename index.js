(function () {
  var promises = {};
  promises.pending = function () {
    var resolved = false,
        fulfilled = false,
        val,
        waiting = [];

    function then(cb, eb, pb) {
      var def = promises.pending();
      function done() {
        var callback = fulfilled ? cb : eb;
        if (callback) {
          setTimeout(function () {
            var value;
            try {
              value = callback(val);
            } catch (ex) {
              return def.reject(ex);
            }
            def.fulfill(value);
          }, 0);
        } else if (fulfilled) {
          def.fulfill(val);
        } else {
          def.reject(val);
        }
      }
      if (resolved) {
        done();
      } else {
        waiting.push(done);
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
      for (var i = 0; i < waiting.length; i++) {
        waiting[i]();
      }
    }
    function fulfill(val) {
      resolve(true, val);
    }
    function reject(err) {
      resolve(false, err);
    }

    return {promise: {then: then}, fulfill: fulfill, reject: reject};
  };

  promises.fulfilled = function (val) {
    var def = promises.pending();
    def.fulfill(val);
    return def.promise;
  };

  promises.rejected = function (err) {
    var def = promises.pending();
    def.reject(err);
    return def.promise;
  };
  if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
    module.exports = promises;
  } else {
    window.promises = promises;
  }
}());