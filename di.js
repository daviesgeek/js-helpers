var DI = function () {}

DI._instances = {};
DI._bindings  = {};

DI.bind = function (value, object) {
  DI._bindings[value] = object
}

DI.get = function (value) {

  if(!(value in this._instances) && !(value in DI._bindings)) {
    throw new ReferenceError('"'+ value + '" could not be found. Perhaps you forgot to bind it? (DI.bind(' + value + ', ' + value + 'Object))')
  }

  if(value in this._instances) {
    return this._instances[value]
  } else {
    this._instances[value] = new DI._bindings[value]()
    return this._instances[value]
  }
}

DI.call = function (func) {
  var funcArgs = func.toString().match(/function\s.*?\(([^)]*)\)/)[1].split(',').map(function (argument) {
    return argument.replace(/\/\*.*\*\//, '').trim();
  })
  var resolved = []

  for (var i = 0; i < funcArgs.length; i++) {
    resolved.push(DI.get(funcArgs[i]))
  }

  return func.apply(func, resolved)
}

window.DI = DI