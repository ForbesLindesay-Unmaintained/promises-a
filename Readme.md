
# promises-a

  A bare bones implementation of Promises/A intended to pass all [promise-tests](https://github.com/domenic/promise-tests) while being as small as possible.

  This is intended to serve as a base for you to build your own promises libraries, which would typically be expected to provide all sorts of useful helpers. Promises created by this library (or any library based off of this) should be compatable with such helpers, but helpers won't ever be included in this library.

## Installation

  Client:

    $ component install ForbesLindesay/promises-a

  Server:

    $ npm install promises-a

  Alternatively you can download it from the [downloads area](https://github.com/ForbesLindesay/promises-a/downloads) and reference it with a script tag:

```html
<script src="promises.min.js"></script>
```

  then just refer to it as the global: `promises`

## Usage

  Here is an example of how to create a promises function to wrap a low level api, and provide a timeout

```javascript
var promise = require('promises-a');
function loadDataAsync(id, timeout) {
  timeout = timeout == null ? 500 : timeout;
  var def = promise();

  callLowLevelAPI(id, function (err, res) {
    if (err) return def.reject(err);
    def.resolve(res);
  });

  if (timeout) {
    setTimeout(function () {
      def.reject(new Error('Operation Timed Out (' + timeout + 'ms)'));
    }, timeout);
  }

  return def.promise;
}
```

  Because the promise can only be resolved once, the rejection will be ignored if the operation is successful within the timeout.  A timeout of 0 will also be treated as infinite.

## API

### promise()

  Return a new `deferred`.

### deferred

#### deferred#promise

  Get the promise represented by the deferred.  This is just an object with a function called then.

#### deferred#fulfill(value)

  Put the promise in a resolved state and fulfill it with the value provided.

#### deferred#reject(error)

  Put the promise in a resolved state and reject it with the error provided.

### promise

#### promise#then(callback, errback, progback)

  You can call then with three optional args.  The callback is called when the promise is fulfilled, the errback is called when the promise is rejected.  At the moment, progback is ignored.  Calls to then can be chained, and you can return a promise from the callback, which will be resolved before being passed to the chained then.

## License

  MIT
