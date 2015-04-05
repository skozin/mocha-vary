This module allows to parametrize Mocha tests through injection
of all required parameters into top-level `describe`s.


## Example

a.js:

```js
var describe = require('mocha-vary').describe

describe('This will be parametrized', function(param1, param2) {
  // some tests, inner describes, etc.
})
```

b.js:

```js
var describe = require('mocha-vary').describe

describe('This will be parametrized too', function(param1, param2) {
  // some tests
})
```

run.js:

```js
var vary = require('mocha-vary')

vary.run({
  'first run' : { params: ['a', 'b'] },
  'second run': { params: ['c', 'd'] }
})
```


## API

The proper documentation is pending, for now you can inspect
[the test suite](https://github.com/skozin/mocha-vary/tree/master/test)
and [the examples](https://github.com/skozin/mocha-vary/tree/master/_example).


# License

MIT
