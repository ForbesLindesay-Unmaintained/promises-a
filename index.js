(function () {
  var promises = {};
  promises.pending = function () {
    var resolved = false,
        fulfilled = false,
        val,
        rejectors = [], acceptors = [];

    function then(cb, eb, pb) {
      var def = promises.pending();
      function fulfill(val) {
        setTimeout(function () {
          if (cb) {
            try {
              val = cb(val);
            } catch (ex) {
              return def.reject(ex);
            }
          }
          def.fulfill(val);
        }, 0);
      }
      function reject(err) {
        setTimeout(function () {
          var val;
          if (eb) {
            try {
              val = eb(err);
            } catch (ex) {
              return def.reject(ex);
            }
            def.fulfill(val);
          } else {
            def.reject(err);
          }
        }, 0);
      }
      if (resolved) {
        if (fulfilled) {
          fulfill(val);
        } else {
          reject(val);
        }
      } else {
        acceptors.push(fulfill);
        rejectors.push(reject);
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
      var cbs = success ? acceptors : rejectors;
      for (var i = 0; i < cbs.length; i++) {
        cbs[i](val);
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