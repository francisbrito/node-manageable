const test = require('blue-tape');
const coroutine = require('co');

const createManageable = require('./');

test(
  'Factory throws if `destroy` and `initialize` or `dependencies` options are invalid.',
  coroutine.wrap(function* (assert) {
    assert.throws(
      createManageable,
      /`destroy` and `initialize` or `dependencies`/,
      'it throws if `destroy` and `initialize` or `dependencies` are missing.'
    );

    assert.throws(
      () => createManageable({ destroy: 'foo', initialize: 'bar' }),
      /`destroy` and `initialize` must be functions/,
      'it throws if `destroy` and `initialize` are not functions.'
    );

    assert.throws(
      () => createManageable({ dependencies: 42 }),
      /`dependencies` must respond to `map` method/,
      'it throws if `dependencies` is not `map`-able.'
    );
  })
);
