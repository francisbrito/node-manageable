module.exports = createManageable;

function createManageable(options) {
  options = options || {};

  const destroy = options.destroy;
  const initialize = options.initialize;
  const dependencies = options.dependencies;

  if (destroy && initialize) {
    if (!(destroy.call && initialize.call)) {
      throw new Error('`destroy` and `initialize` must be functions.');
    }
  } else if (dependencies) {
    if (!dependencies.map) {
      throw new Error('`dependencies` must respond to `map` method.');
    }
  } else {
    throw new Error('Either provide `destroy` and `initialize` or `dependencies` options.');
  }

  return {};
}
