'use strict';

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

test('#initialize throws if already initialized.', coroutine.wrap(function* (assert) {
  try {
    const manageable = createManageable({
      initialize: () => Promise.resolve(), destroy: () => Promise.resolve(),
    });

    yield manageable.initialize();
    yield manageable.initialize();
  } catch (err) {
    assert.ok(err);
    assert.ok(err.message.includes('already initialized'));
  }
}));

test('#destroy throws if not initialized.', coroutine.wrap(function* (assert) {
  try {
    const manageable = createManageable({
      initialize: () => Promise.resolve(), destroy: () => Promise.resolve(),
    });

    yield manageable.destroy();
    yield manageable.destroy();
  } catch (err) {
    assert.ok(err);
    assert.ok(err.message.includes('not initialized'));
  }
}));

test('#destroy calls `destroy` option if present.', coroutine.wrap(function* (assert) {
  let destroyed = false;

  const destroy = () => new Promise(resolve => {
    destroyed = true;

    resolve();
  });
  const initialize = () => Promise.resolve();
  const manageable = createManageable({ destroy, initialize });

  yield manageable.initialize();
  yield manageable.destroy();

  assert.ok(destroyed, 'it calls #destroy.');
}));

test('#initialize calls `initialize` option if present.', coroutine.wrap(function* (assert) {
  let initialized = false;

  const destroy = () => Promise.resolve();
  const initialize = () => new Promise(resolve => {
    initialized = true;

    resolve();
  });
  const manageable = createManageable({ destroy, initialize });

  yield manageable.initialize();

  assert.ok(initialized, 'it calls #initialize');
}));
