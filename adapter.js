var promise = require('./');


exports.pending = promise;

exports.fulfilled = function (val) {
  var def = promise();
  def.fulfill(val);
  return def.promise;
};

exports.rejected = function (err) {
  var def = promise();
  def.reject(err);
  return def.promise;
};